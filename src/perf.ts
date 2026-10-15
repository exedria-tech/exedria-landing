/** performance.mark set when the routed page first commits (hydrated or rendered), read by the live telemetry on /platforma. */
export const MOUNT_MARK = 'exedria:react-mount';

/** True when main.tsx hydrated prerendered HTML instead of rendering from scratch. */
export const boot = { hydrated: false };
