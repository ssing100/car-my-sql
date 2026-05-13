/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Calendar, Info, Search, ChevronRight, Gauge } from 'lucide-react';

interface CarProfile {
  id: number;
  make: string;
  model: string;
  year: number;
  description: string;
  image_url: string;
}

export default function App() {
  const [cars, setCars] = useState<CarProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<CarProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setCars(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const filteredCars = cars.filter(car => 
    `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-high-density-bg p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto bg-high-density-bg text-high-density-text border-4 border-high-density-text flex flex-col min-h-[85vh] shadow-[16px_16px_0px_rgba(20,20,20,1)]">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-6 border-b-4 border-high-density-text gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-high-density-text text-high-density-bg px-3 py-1 font-mono text-xs font-bold tracking-tighter">
              AUTOSQL_DB_V2.1
            </div>
            <h1 className="text-3xl font-serif italic tracking-tight">Inventory Manifest</h1>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase opacity-70">
            <div>Node ID: ais_node_01</div>
            <div>Sync: {new Date().toLocaleTimeString()}</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              DB LIVE
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-72 border-b-4 md:border-b-0 md:border-r-4 border-high-density-text p-6 flex flex-col gap-10">
            <section>
              <h3 className="font-mono text-[11px] uppercase opacity-60 mb-6 border-b border-high-density-text/20 pb-1 font-bold">Search Filters</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-mono text-[9px] uppercase font-bold tracking-widest">Global Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
                    <input 
                      type="text" 
                      placeholder="e.g. Porsche Carrera" 
                      className="w-full bg-transparent border-2 border-high-density-text px-3 py-2 pl-10 text-sm focus:outline-none placeholder:opacity-30 font-mono"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block font-mono text-[9px] uppercase font-bold tracking-widest">Manifest Metadata</label>
                  <div className="space-y-2 font-mono text-[10px] opacity-70 leading-relaxed border-2 border-high-density-text/10 p-3 bg-white/30">
                    <p>Total Records: {cars.length}</p>
                    <p>Filtered: {filteredCars.length}</p>
                    <p>Status: OK</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-auto hidden md:block">
              <div className="bg-high-density-text text-high-density-bg p-4 text-[10px] leading-relaxed font-mono shadow-[4px_4px_0px_rgba(20,20,20,0.2)]">
                <p className="mb-2 border-b border-high-density-bg/20 pb-1">SQL DEBUG:</p>
                <p className="opacity-70 break-all select-all">
                  SELECT * FROM automotive_inventory <br />
                  WHERE availability = 'ACTIVE' <br />
                  ORDER BY release_year DESC;
                </p>
              </div>
            </section>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 flex flex-col overflow-hidden bg-white/40">
            <div className="grid grid-cols-[60px_1fr_1.5fr_80px_120px] bg-white/80 px-6 py-3 border-b-2 border-high-density-text font-serif italic text-[11px] uppercase opacity-60 sticky top-0 z-10 backdrop-blur-sm">
              <span>ID</span>
              <span>Make</span>
              <span>Model</span>
              <span>Year</span>
              <span className="text-right">Action</span>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs divide-y-2 divide-high-density-text/5">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="grid grid-cols-[60px_1fr_1.5fr_80px_120px] px-6 py-5 animate-pulse">
                    <div className="h-3 w-8 bg-black/10" />
                    <div className="h-3 w-16 bg-black/10" />
                    <div className="h-3 w-24 bg-black/10" />
                    <div className="h-3 w-12 bg-black/10" />
                  </div>
                ))
              ) : (
                filteredCars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    onClick={() => setSelectedCar(car)}
                    className="grid grid-cols-[60px_1fr_1.5fr_80px_120px] px-6 py-5 hover:bg-high-density-text hover:text-high-density-bg transition-colors cursor-pointer group group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] items-center"
                  >
                    <span className="opacity-40 group-hover:opacity-60">#{car.id.toString().padStart(3, '0')}</span>
                    <span className="font-bold tracking-tight uppercase">{car.make}</span>
                    <span className="font-sans font-semibold tracking-tight">{car.model}</span>
                    <span className="opacity-80">{car.year}</span>
                    <div className="flex justify-end pr-2">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  </motion.div>
                ))
              )}

              {filteredCars.length === 0 && !loading && (
                <div className="p-20 text-center space-y-4 opacity-40">
                  <div className="text-4xl font-serif italic">No Matches Found</div>
                  <p className="font-mono text-[10px] uppercase tracking-widest">Adjust query parameters in filter module</p>
                </div>
              )}
            </div>

            {/* Sub-Footer */}
            <footer className="p-6 border-t-4 border-high-density-text flex flex-col sm:flex-row justify-between items-center bg-white/60 gap-6">
              <div className="flex gap-10">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase opacity-40 font-mono font-bold tracking-widest mb-1">Records Displayed</span>
                  <span className="text-2xl font-mono leading-none font-bold">{filteredCars.length.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase opacity-40 font-mono font-bold tracking-widest mb-1">Database Load</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-high-density-text/10 rounded-full overflow-hidden">
                      <div className="bg-high-density-text h-full w-[24%]" />
                    </div>
                    <span className="text-xs font-mono">24%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none border-2 border-high-density-text px-6 py-2.5 font-mono text-[10px] uppercase font-bold hover:bg-high-density-text hover:text-high-density-bg transition-all shadow-[4px_4px_0px_rgba(20,20,20,0.1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                  Export Manifest
                </button>
                <button className="flex-1 sm:flex-none bg-high-density-text text-high-density-bg px-6 py-2.5 font-mono text-[10px] uppercase font-bold hover:opacity-90 transition-all shadow-[4px_4px_0px_rgba(20,20,20,0.2)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                   Sync Cloud SQL
                </button>
              </div>
            </footer>
          </main>
        </div>
      </div>

      {/* Detail Modal - Re-Styled for High Density */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-high-density-bg/95 backdrop-blur-md"
            onClick={() => setSelectedCar(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-high-density-bg border-[6px] border-high-density-text overflow-hidden shadow-[24px_24px_0px_rgba(0,0,0,0.15)] max-w-5xl w-full grid md:grid-cols-2 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCar(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-high-density-text text-high-density-bg flex items-center justify-center font-bold hover:scale-105 transition-transform"
              >
                ✕
              </button>

              <div className="relative aspect-square md:aspect-auto border-b-6 md:border-b-0 md:border-r-6 border-high-density-text group">
                <img 
                  src={selectedCar.image_url} 
                  alt={selectedCar.model}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-high-density-text/60 mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>
              
              <div className="p-8 md:p-14 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="bg-high-density-text text-high-density-bg px-4 py-1.5 font-mono text-xs font-bold tracking-widest">
                      REV_{selectedCar.year}
                    </span>
                    <span className="font-mono text-[10px] uppercase opacity-40 font-bold">DB_UID: {selectedCar.id.toString().padStart(6, '0')}</span>
                  </div>

                  <h2 className="text-lg font-mono uppercase tracking-[0.2em] font-bold opacity-40 mb-2">{selectedCar.make}</h2>
                  <h3 className="text-6xl md:text-7xl font-serif italic tracking-tighter mb-8 leading-none">{selectedCar.model}</h3>
                  
                  <div className="space-y-6 mb-10 border-t-2 border-high-density-text/10 pt-8">
                    <div className="space-y-2">
                       <span className="text-[9px] uppercase font-mono font-bold tracking-widest opacity-40">Technical Abstract</span>
                       <p className="text-sm font-sans leading-relaxed opacity-80">{selectedCar.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-4 border-2 border-high-density-text/10 bg-white/20">
                        <div className="flex items-center gap-2 opacity-40 mb-2">
                          <Gauge className="w-3 h-3" />
                          <span className="text-[8px] uppercase tracking-widest font-black">Performance</span>
                        </div>
                        <p className="font-mono font-bold text-sm tracking-tight uppercase">High Caliber</p>
                      </div>
                      <div className="p-4 border-2 border-high-density-text/10 bg-white/20">
                        <div className="flex items-center gap-2 opacity-40 mb-2">
                          <Car className="w-3 h-3" />
                          <span className="text-[8px] uppercase tracking-widest font-black">Architecture</span>
                        </div>
                        <p className="font-mono font-bold text-sm tracking-tight uppercase">Aero-Dynamic</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <button className="bg-green-600 border-4 border-high-density-text py-4 text-white font-mono font-black text-xs uppercase tracking-[0.2em] hover:bg-green-500 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                    Initialize Purchase Sequence
                  </button>
                  <button className="bg-white border-4 border-high-density-text px-6 py-4 font-mono font-black text-xs uppercase hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

