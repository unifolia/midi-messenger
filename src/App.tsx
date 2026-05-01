import { useState, useCallback, useRef, useMemo } from "react";
import MidiCCForm from "./lib/MidiCCForm";
import MidiPCForm from "./lib/MidiPCForm";
import Header from "./lib/Header";
import { FormsContainer, FooterText } from "./styles/components";
import { Title } from "./styles/GlobalStyles";
import Navigation from "./lib/NavBar";
import Device from "./lib/Device";
import useMIDI from "./hooks/useMIDI";
import useDragReorder from "./hooks/useDragReorder";
import { parsePreset } from "./util/presetIo";
import type { MidiCCFormData, MidiPCFormData, Layout } from "./types";

const DEFAULT_BG = "#909090";
const MAX_BLOCKS = 75;

const INITIAL_CC: MidiCCFormData[] = [
  {
    id: 1,
    midiChannel: 1,
    midiCC: 1,
    value: 64,
    label: "MIDI Control Block",
    backgroundColor: DEFAULT_BG,
  },
];

const INITIAL_PC: MidiPCFormData[] = [
  {
    id: -1,
    midiChannel: 1,
    program: 0,
    label: "Program Change",
    backgroundColor: DEFAULT_BG,
  },
];

const App = () => {
  const [layout, setLayout] = useState<Layout>("tile");
  const [forms, setForms] = useState({
    name: "Untitled Preset",
    inputs: INITIAL_CC,
  });
  const nextIdRef = useRef(Math.max(...INITIAL_CC.map((f) => f.id), 0) + 1);
  const [globalMidiChannel, setGlobalMidiChannel] = useState<number | null>(
    null,
  );

  const [pcForms, setPcForms] = useState<MidiPCFormData[]>(INITIAL_PC);
  const nextPcIdRef = useRef(Math.min(...INITIAL_PC.map((f) => f.id), 0) - 1);

  const [formOrder, setFormOrder] = useState<number[]>([
    ...INITIAL_CC.map((f) => f.id),
    ...INITIAL_PC.map((f) => f.id),
  ]);
  const blockCount = forms.inputs.length + pcForms.length;

  const onCC = useCallback((channel: number, cc: number, value: number) => {
    setForms((prev) => ({
      ...prev,
      inputs: prev.inputs.map((form) =>
        form.midiChannel === channel && form.midiCC === cc
          ? { ...form, value }
          : form,
      ),
    }));
  }, []);

  const { deviceList, device, setDevice, isMidiOutput, sendCC, sendPC } =
    useMIDI({ onCC });

  const toggleLayout = useCallback(
    () => setLayout((l) => (l === "tile" ? "row" : "tile")),
    [],
  );

  const allItems = useMemo(() => formOrder.map((id) => ({ id })), [formOrder]);

  const handleReorder = useCallback((reorderedIds: number[]) => {
    setFormOrder(reorderedIds);
    setForms((prev) => ({
      ...prev,
      inputs: reorderedIds
        .filter((id) => prev.inputs.some((f) => f.id === id))
        .map((id) => prev.inputs.find((f) => f.id === id)!),
    }));
    setPcForms((prev) =>
      reorderedIds
        .filter((id) => prev.some((f) => f.id === id))
        .map((id) => prev.find((f) => f.id === id)!),
    );
  }, []);

  const {
    orderedIds,
    draggedId,
    handlePointerDown,
    registerRef,
    containerRef,
  } = useDragReorder(allItems, handleReorder);

  const allFormsById = useMemo(() => {
    const map = new Map<
      number,
      | { type: "cc"; data: MidiCCFormData }
      | { type: "pc"; data: MidiPCFormData }
    >();
    forms.inputs.forEach((f) => map.set(f.id, { type: "cc", data: f }));
    pcForms.forEach((f) => map.set(f.id, { type: "pc", data: f }));
    return map;
  }, [forms.inputs, pcForms]);

  const handleGlobalMidiChannelChange = useCallback(
    (newGlobalChannel: number) => {
      setGlobalMidiChannel(newGlobalChannel);
      setForms((prev) => ({
        ...prev,
        inputs: prev.inputs.map((form) => ({
          ...form,
          midiChannel: newGlobalChannel,
        })),
      }));
      setPcForms((prev) =>
        prev.map((pc) => ({ ...pc, midiChannel: newGlobalChannel })),
      );
    },
    [],
  );

  const getLastBackgroundColor = () => {
    for (let i = formOrder.length - 1; i >= 0; i--) {
      const entry = allFormsById.get(formOrder[i]);
      if (entry) return entry.data.backgroundColor;
    }
    return DEFAULT_BG;
  };

  const handleAddCCInput = () => {
    if (blockCount >= MAX_BLOCKS) return;

    const id = nextIdRef.current++;
    const lastColor = getLastBackgroundColor();
    setForms((prev) => ({
      ...prev,
      inputs: [
        ...prev.inputs,
        {
          id,
          midiChannel: globalMidiChannel ?? 1,
          midiCC: 1,
          value: 64,
          label: "MIDI Control Block",
          backgroundColor: lastColor,
        },
      ],
    }));
    setFormOrder((prev) => [...prev, id]);
  };

  const handleRemoveCCForm = useCallback((id: number) => {
    setForms((prev) => ({
      ...prev,
      inputs: prev.inputs.filter((form) => form.id !== id),
    }));
    setFormOrder((prev) => prev.filter((fid) => fid !== id));
  }, []);

  const handleAddPCInput = () => {
    if (blockCount >= MAX_BLOCKS) return;

    const id = nextPcIdRef.current--;
    const lastColor = getLastBackgroundColor();
    setPcForms((prev) => [
      ...prev,
      {
        id,
        midiChannel: globalMidiChannel || 1,
        program: 0,
        label: "Program Change",
        backgroundColor: lastColor,
      },
    ]);
    setFormOrder((prev) => [...prev, id]);
  };

  const handleRemovePCForm = useCallback((id: number) => {
    setPcForms((prev) => prev.filter((pc) => pc.id !== id));
    setFormOrder((prev) => prev.filter((fid) => fid !== id));
  }, []);

  const updateCCFormField = useCallback(
    (id: number, field: keyof MidiCCFormData, value: string | number) => {
      setForms((prev) => ({
        ...prev,
        inputs: prev.inputs.map((form) =>
          form.id === id ? { ...form, [field]: value } : form,
        ),
      }));
    },
    [],
  );

  const updatePCFormField = useCallback(
    (id: number, field: keyof MidiPCFormData, value: string | number) => {
      setPcForms((prev) =>
        prev.map((form) =>
          form.id === id ? { ...form, [field]: value } : form,
        ),
      );
    },
    [],
  );

  const savePreset = async () => {
    const preset = {
      name: forms.name,
      timestamp: new Date().toISOString(),
      inputs: forms.inputs,
      pcForms,
      formOrder,
      globalMidiChannel,
    };

    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const suggestedName = `${preset.name.replace(/[^a-z0-9]/gi, "_")}`;

    if ("showSaveFilePicker" in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${suggestedName}.json`,
        });
        const writable = await handle.createWritable();
        await writable.write(dataBlob);
        await writable.close();
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          console.error("Save failed:", error);
        }
      }
    } else {
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${suggestedName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleLoadPreset = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const text = event.target?.result as string;
        const result = parsePreset(text, MAX_BLOCKS);

        if (!result.ok) {
          if (result.error === "empty") {
            alert("No valid blocks found in preset file");
          } else if (result.error === "too-many") {
            alert(`Preset files can include up to ${result.max} blocks`);
          } else {
            alert("Invalid preset file");
          }
          return;
        }

        const { preset } = result;
        setForms({ name: preset.name, inputs: preset.inputs });
        nextIdRef.current = Math.max(...preset.inputs.map((f) => f.id), 0) + 1;
        setPcForms(preset.pcForms);
        nextPcIdRef.current =
          Math.min(...preset.pcForms.map((f) => f.id), 0) - 1;
        setFormOrder(preset.formOrder);
        setGlobalMidiChannel(preset.globalMidiChannel);
      };
      reader.readAsText(file);
    },
    [],
  );

  return (
    <main>
      <Title>Messenger</Title>

      {isMidiOutput ? (
        <Device device={device} deviceList={deviceList} setDevice={setDevice} />
      ) : (
        <h2>No MIDI Devices Connected</h2>
      )}

      <Navigation
        handleAddCCInput={handleAddCCInput}
        handleAddPCInput={handleAddPCInput}
        savePreset={savePreset}
        handleLoadPreset={handleLoadPreset}
        globalMidiChannel={globalMidiChannel}
        handleGlobalMidiChannelChange={handleGlobalMidiChannelChange}
        layout={layout}
        onToggleLayout={toggleLayout}
      />

      <Header
        name={forms.name}
        setName={(value: string) =>
          setForms((prev) => ({ ...prev, name: value }))
        }
      />

      <FormsContainer ref={containerRef} $layout={layout}>
        {orderedIds.map((id) => {
          const item = allFormsById.get(id);
          if (!item) return null;
          if (item.type === "cc") {
            const form = item.data;
            return (
              <MidiCCForm
                key={form.id}
                id={form.id}
                onRemove={handleRemoveCCForm}
                updateCCFormField={updateCCFormField}
                midiChannel={form.midiChannel}
                midiCC={form.midiCC}
                value={form.value}
                label={form.label}
                backgroundColor={form.backgroundColor}
                sendCC={sendCC}
                dragRef={registerRef(form.id)}
                onDragPointerDown={handlePointerDown}
                isDragging={draggedId === form.id}
                layout={layout}
              />
            );
          }
          const pc = item.data;
          return (
            <MidiPCForm
              key={pc.id}
              id={pc.id}
              onRemove={handleRemovePCForm}
              updatePCFormField={updatePCFormField}
              midiChannel={pc.midiChannel}
              program={pc.program}
              label={pc.label}
              backgroundColor={pc.backgroundColor}
              sendPC={sendPC}
              dragRef={registerRef(pc.id)}
              onDragPointerDown={handlePointerDown}
              isDragging={draggedId === pc.id}
              layout={layout}
            />
          );
        })}
      </FormsContainer>
      <footer>
        <FooterText><a id="mothership" href="https://midi.engineering">𐙦 MIDI Engineering</a> | <a href="https://github.com/unifolia/midi-messenger">Documentation</a></FooterText>
      </footer>
    </main>
  );
};

export default App;
