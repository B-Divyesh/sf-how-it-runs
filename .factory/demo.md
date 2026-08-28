# Demo sandbox

Open `/demo/` or `/?demo=1`. From the home page, **Try it with sample data** enters the same demo in one click.

The next screen shows the demo banner and water controls in the first mobile viewport. The sample data is 65% settling, 65% filter speed, and 60% disinfectant.

**Reset demo** restores those three values. **Leave demo and clear sample** removes the demo session key before returning home.

Demo changes use only `demo:how-it-runs:state` in session storage. Demo mode never reads or writes a real-data key. Real mode stores settings in the URL and does not use browser storage.
