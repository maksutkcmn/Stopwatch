export function createUI(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; gap: 50px;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div style="
          font-size: 18px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 3px;
          cursor: pointer;
          transition: color 0.3s;
          user-select: none;
        " id="timeLabel" title="Süreyi değiştirmek için tıklayın">
          Süre Ayarı
        </div>

        <div id="stateLabel" style="
          font-size: 24px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 2px;
          user-select: none;
        ">
          Çalışma Süresi
        </div>

        <div style="
          font-size: 180px;
          font-weight: bold;
          font-family: monospace;
          color: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        " id="timer" title="Süreyi değiştirmek için tıklayın">
          50:00
        </div>
      </div>

      <button id="startBtn" style="
        font-size: 24px;
        padding: 20px 60px;
        border-radius: 50px;
        background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
        border: none;
        color: #e5e7eb;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      ">Başlat</button>
    </div>

    <!-- Ayar Modal -->
    <div id="settingsModal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    ">
      <div style="
        background: #1a1a1a;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        min-width: 400px;
        border: 1px solid #333;
      ">
        <h2 style="
          margin: 0 0 30px 0;
          text-align: center;
          color: #d1d5db;
          font-size: 28px;
        ">Süre Ayarları</h2>

        <div style="margin-bottom: 25px;">
          <label style="
            display: block;
            margin-bottom: 10px;
            color: #888;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
          ">Çalışma Süresi (Dakika)</label>
          <input
            type="number"
            id="workMinutesInput"
            min="1"
            style="
              width: 100%;
              padding: 15px;
              font-size: 24px;
              border: 2px solid #333;
              border-radius: 10px;
              background: #0a0a0a;
              color: white;
              text-align: center;
              font-weight: bold;
              transition: border-color 0.3s;
            "
          />
        </div>

        <div style="margin-bottom: 30px;">
          <label style="
            display: block;
            margin-bottom: 10px;
            color: #888;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
          ">Mola Süresi (Dakika)</label>
          <input
            type="number"
            id="breakMinutesInput"
            min="1"
            style="
              width: 100%;
              padding: 15px;
              font-size: 24px;
              border: 2px solid #333;
              border-radius: 10px;
              background: #0a0a0a;
              color: white;
              text-align: center;
              font-weight: bold;
              transition: border-color 0.3s;
            "
          />
        </div>

        <div style="display: flex; gap: 15px;">
          <button id="cancelBtn" style="
            flex: 1;
            padding: 15px;
            font-size: 18px;
            border-radius: 10px;
            border: 2px solid #333;
            background: transparent;
            color: #888;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
          ">İptal</button>

          <button id="saveBtn" style="
            flex: 1;
            padding: 15px;
            font-size: 18px;
            border-radius: 10px;
            background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
            border: none;
            color: #e5e7eb;
            cursor: pointer;
            transition: transform 0.2s;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          ">Kaydet</button>
        </div>
      </div>
    </div>
  `
}
