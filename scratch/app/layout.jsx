import './globals.css';
export var metadata = {
    title: 'DermaSyntax — Skincare Routine Simulator & Conflict Compiler',
    description: 'An IDE for your face. Build your AM/PM skincare routine and let the compiler detect chemical conflicts, oxidation warnings, and synergy opportunities.',
    keywords: ['skincare', 'routine', 'ingredient conflict', 'retinol', 'vitamin c', 'IDE'],
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en" className="dark">
      <body className="min-h-screen bg-ide-bg text-slate-200 antialiased">
        {children}
      </body>
    </html>);
}
