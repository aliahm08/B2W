import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { B2WSilhouetteMark } from '../components/BrandVectorMarks';
import B2WIcon from '../components/logo/B2WIcon';
import Seo from '../components/Seo';

const sizes = [16, 24, 32, 48, 64, 96, 128, 256] as const;

const checkerboardStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  backgroundImage:
    'linear-gradient(45deg, #d4d4d4 25%, transparent 25%), linear-gradient(-45deg, #d4d4d4 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d4d4 75%), linear-gradient(-45deg, transparent 75%, #d4d4d4 75%)',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
  backgroundSize: '16px 16px',
};

type LogoSource = 'original' | 'svg' | 'component' | 'png';
type Background = 'white' | 'black' | 'checkerboard';

const sourceLabels: Record<LogoSource, string> = {
  original: 'Original Inline',
  svg: 'SVG Asset',
  component: 'React Component',
  png: 'PNG Export',
};

function LogoRenderer({
  source,
  className = '',
}: {
  source: LogoSource;
  className?: string;
}) {
  if (source === 'original') {
    return <B2WSilhouetteMark title="" className={`block h-auto w-full ${className}`.trim()} />;
  }

  if (source === 'component') {
    return <B2WIcon title="" className={`block h-auto w-full ${className}`.trim()} />;
  }

  if (source === 'svg') {
    return (
      <svg
        viewBox="0 0 96 88.4925"
        role="img"
        aria-label="B2W icon rendered from the extracted SVG asset"
        className={`block h-auto w-full ${className}`.trim()}
      >
        <use href="/brand/b2w-icon.svg#b2w-icon-path" />
      </svg>
    );
  }

  return (
    <img
      src="/brand/verification/b2w-icon.png"
      alt=""
      className={`block h-auto w-full ${className}`.trim()}
    />
  );
}

function backgroundStyle(background: Background): CSSProperties {
  if (background === 'black') {
    return { backgroundColor: '#000000' };
  }

  if (background === 'checkerboard') {
    return checkerboardStyle;
  }

  return { backgroundColor: '#ffffff' };
}

function Sample({
  source,
  size,
  background,
}: {
  source: LogoSource;
  size: number;
  background: Background;
}) {
  return (
    <div
      className={`flex min-h-[304px] min-w-[288px] items-center justify-center border border-neutral-300 p-4 ${
        background === 'black' ? 'text-white' : 'text-black'
      }`}
      style={backgroundStyle(background)}
      data-source={source}
      data-size={size}
      data-background={background}
    >
      <div style={{ width: `${size}px` }}>
        <LogoRenderer source={source} className={background === 'black' && source === 'png' ? 'invert' : ''} />
      </div>
    </div>
  );
}

function VerificationGrid({ background }: { background: Background }) {
  return (
    <section className="mt-12" aria-labelledby={`${background}-heading`}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Render matrix</p>
          <h2 id={`${background}-heading`} className="mt-1 text-2xl font-semibold capitalize">
            {background === 'checkerboard' ? 'Transparent checkerboard' : `${background} background`}
          </h2>
        </div>
        <p className="text-sm text-neutral-500">Size is the rendered width; height follows the unchanged viewBox ratio.</p>
      </div>

      <div className="overflow-x-auto border border-neutral-300">
        <div className="grid min-w-[1240px] grid-cols-[88px_repeat(4,minmax(288px,1fr))]">
          <div className="sticky left-0 z-10 border-b border-r border-neutral-300 bg-neutral-100 p-3 text-xs font-semibold uppercase tracking-wide text-neutral-600">
            Width
          </div>
          {(Object.keys(sourceLabels) as LogoSource[]).map((source) => (
            <div
              key={source}
              className="border-b border-r border-neutral-300 bg-neutral-100 p-3 text-sm font-semibold last:border-r-0"
            >
              {sourceLabels[source]}
            </div>
          ))}

          {sizes.map((size) => (
            <div key={`${background}-${size}`} className="contents">
              <div className="sticky left-0 z-10 flex items-center justify-center border-b border-r border-neutral-300 bg-neutral-100 p-3 font-mono text-sm">
                {size}px
              </div>
              {(Object.keys(sourceLabels) as LogoSource[]).map((source) => (
                <div key={`${background}-${size}-${source}`}>
                  <Sample source={source} size={size} background={background} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DifferencePair({
  first,
  second,
  size,
}: {
  first: LogoSource;
  second: LogoSource;
  size: number;
}) {
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = Math.round((size * 88.4925) / 96);

  useEffect(() => {
    let isCancelled = false;

    const loadImage = (sourceUrl: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = sourceUrl;
      });

    const loadSource = async (source: LogoSource, container: HTMLDivElement | null) => {
      if (source === 'png') {
        return {
          image: await loadImage('/brand/verification/b2w-icon.png'),
          cleanup: () => undefined,
        };
      }

      let markup: string;

      if (source === 'svg') {
        const response = await fetch('/brand/b2w-icon.svg');

        if (!response.ok) {
          throw new Error(`Unable to load extracted SVG (${response.status}).`);
        }

        markup = await response.text();
      } else {
        const svg = container?.querySelector('svg');

        if (!svg) {
          throw new Error(`Unable to serialize ${source} SVG.`);
        }

        const clone = svg.cloneNode(true) as SVGSVGElement;
        clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clone.removeAttribute('class');
        markup = new XMLSerializer().serializeToString(clone);
      }

      const objectUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));

      return {
        image: await loadImage(objectUrl),
        cleanup: () => URL.revokeObjectURL(objectUrl),
      };
    };

    const renderDifference = async () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const [firstSource, secondSource] = await Promise.all([
        loadSource(first, firstRef.current),
        loadSource(second, secondRef.current),
      ]);

      try {
        if (isCancelled) {
          return;
        }

        const comparisonCanvas = document.createElement('canvas');
        comparisonCanvas.width = size;
        comparisonCanvas.height = height;
        const comparisonContext = comparisonCanvas.getContext('2d', { willReadFrequently: true });
        const outputContext = canvas.getContext('2d');

        if (!comparisonContext || !outputContext) {
          return;
        }

        comparisonContext.clearRect(0, 0, size, height);
        comparisonContext.drawImage(firstSource.image, 0, 0, size, height);
        const firstPixels = comparisonContext.getImageData(0, 0, size, height);

        comparisonContext.clearRect(0, 0, size, height);
        comparisonContext.drawImage(secondSource.image, 0, 0, size, height);
        const secondPixels = comparisonContext.getImageData(0, 0, size, height);
        const output = outputContext.createImageData(size, height);

        for (let index = 0; index < output.data.length; index += 4) {
          const difference = Math.max(
            Math.abs(firstPixels.data[index] - secondPixels.data[index]),
            Math.abs(firstPixels.data[index + 1] - secondPixels.data[index + 1]),
            Math.abs(firstPixels.data[index + 2] - secondPixels.data[index + 2]),
            Math.abs(firstPixels.data[index + 3] - secondPixels.data[index + 3]),
          );

          output.data[index] = difference;
          output.data[index + 1] = difference;
          output.data[index + 2] = difference;
          output.data[index + 3] = 255;
        }

        outputContext.putImageData(output, 0, 0);
      } finally {
        firstSource.cleanup();
        secondSource.cleanup();
      }
    };

    void renderDifference();

    return () => {
      isCancelled = true;
    };
  }, [first, height, second, size]);

  return (
    <div className="flex min-h-[304px] min-w-[288px] items-center justify-center border border-neutral-800 bg-black p-4 text-white">
      <canvas
        ref={canvasRef}
        width={size}
        height={height}
        aria-label={`${sourceLabels[first]} and ${sourceLabels[second]} pixel difference at ${size}px`}
        className="block bg-black"
        style={{ width: `${size}px`, height: `${height}px` }}
      />
      <div aria-hidden="true" className="pointer-events-none fixed -left-[10000px] top-0" style={{ width: `${size}px` }}>
        <div ref={firstRef}>
          <LogoRenderer source={first} />
        </div>
        <div ref={secondRef}>
          <LogoRenderer source={second} />
        </div>
      </div>
    </div>
  );
}

const differencePairs: Array<{
  first: LogoSource;
  second: LogoSource;
  label: ReactNode;
}> = [
  { first: 'original', second: 'svg', label: <>Original Inline <span aria-hidden="true">↔</span> SVG Asset</> },
  { first: 'original', second: 'component', label: <>Original Inline <span aria-hidden="true">↔</span> React Component</> },
  { first: 'svg', second: 'png', label: <>SVG Asset <span aria-hidden="true">↔</span> PNG Export</> },
];

function DifferenceGrid() {
  return (
    <section className="mt-16" aria-labelledby="difference-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Difference blending</p>
      <h2 id="difference-heading" className="mt-1 text-2xl font-semibold">
        Pixel alignment overlays
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
        Each source is rasterized onto an equal-size transparent canvas and compared channel by channel. A completely black
        result means there is no pixel difference.
      </p>

      {differencePairs.map((pair) => (
        <div key={`${pair.first}-${pair.second}`} className="mt-8">
          <h3 className="mb-3 text-base font-semibold">{pair.label}</h3>
          <div className="overflow-x-auto">
            <div className="grid min-w-max grid-flow-col auto-cols-[288px]">
              {sizes.map((size) => (
                <div key={`${pair.first}-${pair.second}-${size}`}>
                  <div className="border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono text-xs text-neutral-300">{size}px</div>
                  <DifferencePair first={pair.first} second={pair.second} size={size} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function LogoVerificationPage() {
  return (
    <>
      <Seo
        title="B2W Logo Verification"
        description="Visual verification of the extracted B2W silhouette logo."
        canonicalPath="/brand/logo-verification"
        robots="noindex, nofollow"
      />
      <div className="min-h-screen bg-[#f5f5f3] text-neutral-950">
        <header className="border-b border-neutral-300 bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">B2W · Phase 1</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Logo extraction verification</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              The original inline path, extracted SVG, React wrapper, and transparent PNG are shown at identical widths.
              No homepage references have been changed.
            </p>
            <dl className="mt-6 grid max-w-3xl gap-3 text-sm sm:grid-cols-2">
              <div className="border border-neutral-300 bg-neutral-50 p-3">
                <dt className="text-neutral-500">ViewBox</dt>
                <dd className="mt-1 font-mono">0 0 96 88.4925</dd>
              </div>
              <div className="border border-neutral-300 bg-neutral-50 p-3">
                <dt className="text-neutral-500">Aspect ratio</dt>
                <dd className="mt-1 font-mono">96 / 88.4925</dd>
              </div>
            </dl>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
          <VerificationGrid background="white" />
          <VerificationGrid background="black" />
          <VerificationGrid background="checkerboard" />
          <DifferenceGrid />
        </main>
      </div>
    </>
  );
}
