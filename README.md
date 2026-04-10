# Kabelblick

[![Featured on oeradio.at](https://img.shields.io/badge/Featured_on-oeradio.at-2563eb?style=flat-square)](https://oeradio.at/werkzeuge/) [![Live Demo](https://img.shields.io/badge/Live_Demo-kabelblick.oeradio.at-16a34a?style=flat-square)](https://kabelblick.oeradio.at) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> 🎙️ **Part of the [oeradio.at](https://oeradio.at/werkzeuge/) open source ham radio tool collection.**
> Browse all tools → [**oeradio.at/werkzeuge**](https://oeradio.at/werkzeuge/)

RF coaxial cable attenuation calculator for amateur radio operators.

## Features

- Calculate signal attenuation for common coaxial cables
- Frequency-dependent calculations with logarithmic interpolation
- Quick selection of amateur radio bands (HF, VHF, UHF)
- Live calculation updates
- Output power display for 5W, 10W, and 100W transmit power
- Visual loss indicator with color coding
- Dark mode support
- Mobile responsive

## Included Cables

- RG-58/U, RG-174/U (thin, flexible)
- RG-213/U, RG-8X (standard 50Ω)
- LMR-400, LMR-600 (low-loss)
- Aircom Plus, Ecoflex 10/15 (ultra low-loss)
- H-155/CLF-200 (European standard)

## Technical Details

### Calculation Method

Attenuation values are interpolated logarithmically between known data points. This approach is more accurate than linear interpolation because coaxial cable attenuation follows approximately:

```
α(f) ≈ k₁√f + k₂f
```

Where the first term represents conductor (skin effect) losses and the second term represents dielectric losses. This relationship is approximately linear on a log-log scale.

### Formulas

- **Total attenuation**: `α_total = α_per_100m × (length_m / 100)`
- **Signal loss %**: `loss = (1 - 10^(-α_total/10)) × 100`
- **Output power**: `P_out = P_in × 10^(-α_total/10)`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Docker

Build and run with Docker:

```bash
docker build -t kabelblick .
docker run -p 8080:80 kabelblick
```

Then open http://localhost:8080

## Project Structure

```
kabelblick/
├── public/
│   └── data/
│       └── cables.json      # Cable specifications (versioned)
├── src/
│   ├── components/          # Vue components
│   ├── composables/         # Vue composables
│   ├── lib/
│   │   └── rf-calculations.js  # Pure JS RF math
│   ├── App.vue
│   └── main.js
├── tests/
│   └── rf-calculations.test.js
├── Dockerfile
└── nginx.conf
```

## Data Sources

Cable attenuation values are compiled from manufacturer specifications and the ARRL Antenna Book. See `public/data/cables.json` for the complete dataset with version information.

## License

MIT
