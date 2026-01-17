/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />

// Fallback manual definition to satisfy TypeScript when official types fail to load
interface ThreeElementsFallback {
    group: any;
    mesh: any;
    instancedMesh: any;
    primitive: any;

    // Geometries
    boxGeometry: any;
    cylinderGeometry: any;
    planeGeometry: any;
    sphereGeometry: any;
    torusGeometry: any;
    ringGeometry: any;
    circleGeometry: any;

    // Materials
    meshStandardMaterial: any;
    meshPhysicalMaterial: any;
    meshBasicMaterial: any;

    // Lights
    ambientLight: any;
    pointLight: any;
    spotLight: any;
    directionalLight: any;

    // Allow others
    [key: string]: any;
}

declare global {
    namespace JSX {
        interface IntrinsicElements extends ThreeElementsFallback { }
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements extends ThreeElementsFallback { }
        }
    }
}
