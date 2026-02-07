"use client";

/**
 * Debug component to test CSS icon rendering
 */
export default function IconDebug() {
  return (
    <div style={{ padding: '20px', background: '#000', color: '#fff' }}>
      <h2>Icon Debug Test</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Home Icon */}
        <div style={{ textAlign: 'center' }}>
          <div className="icon-container relative w-8 h-8" style={{ border: '1px solid red' }}>
            <div className="icon-home text-white" />
          </div>
          <p>Home</p>
        </div>

        {/* Music Icon */}
        <div style={{ textAlign: 'center' }}>
          <div className="icon-container relative w-8 h-8" style={{ border: '1px solid red' }}>
            <div className="icon-music text-white" />
          </div>
          <p>Music</p>
        </div>

        {/* Shows Icon */}
        <div style={{ textAlign: 'center' }}>
          <div className="icon-container relative w-8 h-8" style={{ border: '1px solid red' }}>
            <div className="icon-shows text-white" />
          </div>
          <p>Shows</p>
        </div>

        {/* About Icon */}
        <div style={{ textAlign: 'center' }}>
          <div className="icon-container relative w-8 h-8" style={{ border: '1px solid red' }}>
            <div className="icon-about text-white" />
          </div>
          <p>About</p>
        </div>
      </div>
    </div>
  );
}
