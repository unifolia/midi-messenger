# MIDI Messenger

MIDI Messenger is a control station for your MIDI-equipped guitar pedals. Pick a device, nudge some sliders, fire a program change, and save the whole setup as a preset for next time. 🎸

At its core, the app is built around blocks: small modules that _do a thing_.
Blocks can send CC messages, which are often used to change individual
parameters or settings, or PC messages, which are usually used for more 'advanced' things like saving and recalling presets. 🕺

## Use the MIDI Messenger to:

- Send CC and PC messages to your favorite MIDI gear. 📞
- Customize the label and background color of each block. 🌈
- Drag to reorder your blocks. 🔀
- Switch between tile and strip layouts for the entire grid. 🏄‍♂️
- Save and load presets, which contain _ALL_ of your blocks! 🧠

## Quick Start

1. Connect a MIDI device.
2. Start MIDI Messenger and choose a device from the **MIDI Device** menu.
3. Add CC or PC blocks as needed.
4. Set each block's MIDI channel and CC/program number.
5. Move CC sliders or click **Send** on a PC block.
6. Name and save the preset when the setup feels right.

### CC Blocks

CC blocks send MIDI Control Change messages.

- **Channel** selects MIDI channels 1-16.
- **MIDI CC** selects CC numbers 0-127.
- **Value** sends values 0-127 as the slider moves.
- Click or focus the block's title to rename it.
- The color swatch opens a picker for a custom background.
- Refer to your pedal or device's MIDI documentation for what CC message corresponds to what setting.

### PC Blocks

PC blocks send MIDI Program Change messages.

- **Channel** chooses MIDI channels 1-16.
- **MIDI PC** chooses PC numbers 0-127.
- **Send** fires the selected program change.
- Titles and colors work the same way as they do for CC blocks.
- Refer to your pedal or device's MIDI documentation for what PC message corresponds to what setting.

### Global Channel

Use **Global Channel** when every block should use the same MIDI channel.
Choosing a channel updates all current CC and PC blocks. New blocks will start
on that channel too.

### Layouts

Use the layout button to switch between:

- **Tile**: a grid of blocks. Think cards, thumbnails, etc.
- **Strip**: a more compact row-style layout. Helpful for fitting a lot on your screen, especially at larger screen widths.

On narrow screens, the app keeps things stacked so controls stay usable.

You can have up to 75 blocks in total. This is probably too many blocks... but, hey, do your thing. 🔢

## Presets

Presets are saved as JSON files. A preset includes:

- Preset name.
- Timestamp.
- CC block data.
- PC block data.
- Block order.
- Selected global MIDI channel, if one is set.

Load saved files with **Load Preset**. The loader validates the shape of the preset
file before applying it, so that you can't just load anything.

## Troubleshooting

**No devices appear**

Make sure the MIDI device or virtual port is connected before loading the app,
then refresh the page. Also check that the browser has permission to use MIDI.

**Anything else**

Contact me at james@jameslewis.io if anything is funky, and I will try to fix it
ASAP. I have done my best to keep things smooth, but stuff happens. 🤷‍♂️😗
