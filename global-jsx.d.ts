// Ambient global declarations for Three.js elements
// This file is not a module (no top-level imports), so it affects the global scope directly.

type ThreeElements = import('@react-three/fiber').ThreeElements;

declare namespace JSX {
    interface IntrinsicElements extends ThreeElements { }
}

declare namespace React {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements { }
    }
}
