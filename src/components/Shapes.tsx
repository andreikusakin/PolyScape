export const Sine = () => {
  return (
    <svg
      width="92"
      height="26"
      viewBox="0 0 92 26"
      fill="none"
      filter="drop-shadow(0 0 4px #FF543D"
    >
      <path
        d="M1 13C3.25 7 5.5 1 8.5 1C14.5 1 17.5 25 23.5 25C29.5 25 32.5 1 38.5 1C44.5 1 47.5 25 53.5 25C59.5 25 62.5 1 68.5 1C74.5 1 77.5 25 83.5 25C86.5 25 88.75 19 91 13"
        stroke="#FF543D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const Sawtooth = () => {
  return (
    <svg
      width="92"
      height="26"
      viewBox="0 0 92 26"
      fill="none"
      filter="drop-shadow(0 0 4px #49FF92"
    >
      <path
        d="M1 13L16 1V25L46 1V25L76 1V25L91 13"
        stroke="#49FF92"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const Square = () => {
  return (
    <svg
      width="92"
      height="26"
      viewBox="0 0 92 26"
      fill="none"
      filter="drop-shadow(0 0 4px #2A99FF"
    >
      <path
        d="M1 1H16V25H31V1H46V25H61V1H76V25H91"
        stroke="#2A99FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const Triangle = () => {
  return (
    <svg
      width="92"
      height="26"
      viewBox="0 0 92 26"
      fill="none"
      filter="drop-shadow(0 0 4px #E859FF"
    >
      <path
        d="M1 13L8.5 1L23.5 25L38.5 1L53.5 25L68.5 1L83.5 25L91 13"
        stroke="#E859FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const NoiseShape = ({ color }: { color: string }) => {
  return (
    <svg
      width="312"
      height="32"
      viewBox="0 0 312 32"
      fill="none"
      filter={`drop-shadow(0 0 4px ${color})`}
    >
      <path
      d="M0 13.6543H4V26.1574H8V12.491H12V26.5869H16V3.90192H20V18.6263H24V6.06209H28V20.4317H32V8.64651H36V14.1733H40V12.9995H44V21.9855H48V9.36131H52V18.0936H56V8.1749H60V15.6071H64V10.6288H68V24.1815H72V11.2709H76V25.6268H80V3.20397H84V19.7979H88V9.01075H92V17.1525H96V0.894307H100V24.292H104V1.55647H108V23.1372H112V9.25604H116V24.4983H120V0.586914H124V15.7534H128V7.64012H132V15.5397H136V5.60522H140V26.1648H144V9.94241H148V18.5747H152V9.01286H156V14.1807M156 13.6543H160V26.1574H164V12.491H168V26.5869H172V3.90192H176V18.6263H180V6.06209H184V20.4317H188V8.64651H192V14.1733H196V12.9995H200V21.9855H204V9.36131H208V18.0936H212V8.1749H216V15.6071H220V10.6288H224V24.1815H228V11.2709H232V25.6268H236V3.20397H240V19.7979H244V9.01075H248V17.1525H252V0.894307H256V24.292H260V1.55647H264V23.1372H268V9.25604H272V24.4983H276V0.586914H280V15.7534H284V7.64012H288V15.5397H292V5.60522H296V26.1648H300V9.94241H304V18.5747H308V9.01286H312V14.1807"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
};
