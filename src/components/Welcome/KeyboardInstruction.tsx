import styles from "./KeyboardInstruction.module.css";

export const KeyboardInstruction = () => {
  const generateKeys = () => {
    const keys = [];
    const keyPattern = [
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
    ];
    for (let i = 0; i <= 17; i++) {
      keys.push({ note: i + 24, type: keyPattern[i % 12] ? "white" : "black" });
    }
    return keys;
  };
  const velocityKeys = [
    { 1: 1 },
    { 2: 14 },
    { 3: 28 },
    { 4: 42 },
    { 5: 56 },
    { 6: 70 },
    { 7: 84 },
    { 8: 98 },
    { 9: 112 },
    { 0: 127 },
  ];
  return (
    <div
      className={styles.instructions}
     
    >
      <h5>Virtual Keyboard</h5>
      <div className={styles.velocity}
         style={
          {
            "--color-rgb": "236, 3, 252",
          } as React.CSSProperties
        }
      >
        <span className={styles.setting_name}>Velocity</span>
        {velocityKeys.map((k, i) => (
          <div key={i} className={styles.settings_key}>
            <div className={styles.settings_key_velocity}>
              {Object.values(k)}
            </div>
            <div className={styles.velocity_key_note}>{Object.keys(k)}</div>
          </div>
        ))}
      </div>
      <div className={styles.keyboard}
         style={
          {
            "--color-rgb": "0, 255, 255",
          } as React.CSSProperties
        }
      >
        <div className={styles.setting_name}><p>Keys</p>C4 - F5</div>
        <div className={styles.keyboard_wrapper}>
          <div className={styles.container}>
            <ul className={styles.keys}>
              {generateKeys().map((k) => (
                <li
                  key={k.note}
                  className={`${styles.key} ${styles[k.type]}`}
                  //   id={k.type === "white" ? "white" : "black"}
                ></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.octaves}
            style={
              {
                "--color-rgb": "252, 132, 3",
              } as React.CSSProperties
            }
      >
        <span className={styles.setting_name}>Octaves</span>
        <div className={styles.settings_key}>
          <div className={styles.settings_key_velocity}>-</div>
          <div className={styles.velocity_key_note}>Z</div>
        </div>
        <div className={styles.settings_key}>
          <div className={styles.settings_key_velocity}>+</div>
          <div className={styles.velocity_key_note}>X</div>
        </div>
      </div>
    </div>
  );
};
