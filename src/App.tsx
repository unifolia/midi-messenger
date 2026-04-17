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
import type { MidiCCFormData, MidiPCFormData, Layout } from "./types";

const DEFAULT_BG = "#909090";

const App = () => {
  const [layout, setLayout] = useState<Layout>("tile");
  const [forms, setForms] = useState({
    name: "Untitled Preset",
    inputs: [
      {
        id: 1,
        midiChannel: 1,
        midiCC: 1,
        value: 64,
        label: "MIDI Control Block",
        backgroundColor: DEFAULT_BG,
      },
    ],
  });
  const nextIdRef = useRef(2);
  const [globalMidiChannel, setGlobalMidiChannel] = useState<number | null>(
    null,
  );

  const [pcForms, setPcForms] = useState<MidiPCFormData[]>([
    {
      id: -1,
      midiChannel: 1,
      program: 0,
      label: "Program Change",
      backgroundColor: DEFAULT_BG,
    },
  ]);
  const nextPcIdRef = useRef(-2);

  const [formOrder, setFormOrder] = useState<number[]>([1, -1]);

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

  const handleGlobalMidiChannelChange = (newGlobalChannel: number) => {
    setGlobalMidiChannel(newGlobalChannel);
    if (newGlobalChannel !== null) {
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
    }
  };

  const handleAddCCInput = () => {
    if (forms.inputs.length < 50) {
      const id = nextIdRef.current++;
      const lastColor =
        forms.inputs[forms.inputs.length - 1]?.backgroundColor || DEFAULT_BG;
      setForms((prev) => ({
        ...prev,
        inputs: [
          ...prev.inputs,
          {
            id,
            midiChannel: globalMidiChannel || 1,
            midiCC: 1,
            value: 64,
            label: "MIDI Control Block",
            backgroundColor: lastColor,
          },
        ],
      }));
      setFormOrder((prev) => [...prev, id]);
    }
  };

  const handleRemoveCCForm = useCallback((id: number) => {
    setForms((prev) => ({
      ...prev,
      inputs: prev.inputs.filter((form) => form.id !== id),
    }));
    setFormOrder((prev) => prev.filter((fid) => fid !== id));
  }, []);

  const handleAddPCInput = () => {
    const id = nextPcIdRef.current--;
    const lastColor =
      pcForms[pcForms.length - 1]?.backgroundColor || DEFAULT_BG;
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
      forms: forms.inputs,
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

  const handleLoadPreset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result as string;
          const preset = JSON.parse(result);
          if (!preset.forms || !Array.isArray(preset.forms)) {
            alert("Invalid preset file");
            return;
          }

          const validForms = preset.forms.filter(
            (f: Record<string, unknown>) =>
              typeof f.id === "number" &&
              typeof f.midiChannel === "number" &&
              typeof f.midiCC === "number" &&
              typeof f.value === "number" &&
              typeof f.label === "string" &&
              typeof f.backgroundColor === "string",
          ) as MidiCCFormData[];

          if (validForms.length === 0) {
            alert("No valid CC forms found in preset file");
            return;
          }

          setForms({
            name:
              typeof preset.name === "string" ? preset.name : "Untitled Preset",
            inputs: validForms,
          });

          const maxId = Math.max(...validForms.map((f) => f.id), 0);
          nextIdRef.current = maxId + 1;

          let loadedPcForms: MidiPCFormData[] = [];
          if (Array.isArray(preset.pcForms)) {
            loadedPcForms = preset.pcForms.filter(
              (f: Record<string, unknown>) =>
                typeof f.id === "number" &&
                typeof f.midiChannel === "number" &&
                typeof f.program === "number" &&
                typeof f.label === "string" &&
                typeof f.backgroundColor === "string",
            ) as MidiPCFormData[];
            if (loadedPcForms.length > 0) {
              setPcForms(loadedPcForms);
              const minPcId = Math.min(...loadedPcForms.map((f) => f.id), 0);
              nextPcIdRef.current = minPcId - 1;
            }
          } else if (
            preset.pcForm &&
            typeof preset.pcForm.midiChannel === "number" &&
            typeof preset.pcForm.program === "number" &&
            typeof preset.pcForm.label === "string" &&
            typeof preset.pcForm.backgroundColor === "string"
          ) {
            loadedPcForms = [{ id: -1, ...preset.pcForm }];
            setPcForms(loadedPcForms);
            nextPcIdRef.current = -2;
          }

          const allLoadedIds = new Set([
            ...validForms.map((f) => f.id),
            ...loadedPcForms.map((f) => f.id),
          ]);

          if (Array.isArray(preset.formOrder)) {
            // Filter out stale IDs and append any missing ones
            const validOrder = preset.formOrder.filter((id: number) =>
              allLoadedIds.has(id),
            );
            const inOrder = new Set(validOrder);
            for (const id of allLoadedIds) {
              if (!inOrder.has(id)) validOrder.push(id);
            }
            setFormOrder(validOrder);
          } else {
            // Backward compat: CC forms first, then PC forms
            setFormOrder([...allLoadedIds]);
          }

          if (typeof preset.globalMidiChannel === "number") {
            setGlobalMidiChannel(preset.globalMidiChannel);
          }
        } catch (error) {
          alert("Invalid preset file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <main>
      <Title>Messenger</Title>

      {isMidiOutput ? (
        <Device device={device} deviceList={deviceList} setDevice={setDevice} />
      ) : (
        <h2>No Midi Devices Connected</h2>
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
        <FooterText>𐙦 Midi Engineering</FooterText>
      </footer>
    </main>
  );
};

export default App;
