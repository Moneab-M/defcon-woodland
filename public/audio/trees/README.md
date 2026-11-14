# Talking Tree audio

Prerecorded MP3 recordings for each Talking Tree, one file per tree and language.

Naming convention: `<tree ID>_<lang>.mp3` (for example `yellow-birch-1_en.mp3`,
`yellow-birch-1_fr.mp3`). Only English (`en`) and French (`fr`) are planned.

The recordings are pending. Each `*.mp3.PLACEHOLDER.txt` file marks a recording that is
needed; delete the marker when you add the real MP3, then switch that tree and language
to `recorded: true` in `src/talkingTrees/treeAudio.js`. The text to record is in
`docs/talking-trees/recording-script.md`.
