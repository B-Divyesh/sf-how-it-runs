# Demo sandbox

Open `/demo/` or `/?demo=1` for the one-click sample. It opens Clean water works at 65% settling, 65% filter speed, and 60% disinfectant dose.

The persistent banner says “Demo — sample data, nothing is saved.” **Reset demo** restores the same water sample. **Start for real** leaves the demo and removes the sample route.

Demo changes are stored only under the `demo:how-it-runs:state` session-storage key. Real mode stores no browser data; its shareable settings are in the URL. Demo code never reads or writes a real storage key.
