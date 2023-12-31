# How to run tests

## JavaScript tests

1. Open test code HTML (e.g. `Tests_xxx.html`) with browser
2. Open JavaScript console
   * Almost of all browsers can open with F12 key
3. Click test buttons on page
4. Check console output

## Python tests

Run test source with python interpreter.

```sh
python <test source>

# e.g.
python src/tests/Tests_jpeg_opt.py
```

Or specify target with `unittest` module.

```sh
python -m unittest <target directory/class/method>

# e.g.
python -m unittest src.tests                                      # All tests
python -m unittest src.tests.Tests_jpeg_opt                       # All tests in Tests_jpeg_opt
python -m unittest src.tests.Tests_jpeg_opt.test_JpegOptimizing   # Run only test_JpegOptimizing
```

> [!IMPORTANT]
>
> Backend test `Test_main_back.py` needs to run `main.py` in background.
>
> Some tests need test data files `img1.jpg`, `img2.jpg`, `img3.jpg`, `invalid.jpg`, `invalid.txt`.
>
> More detail, please see each test code's docstring.
