"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Search,CheckCircle2,Calendar,Zap} from 'lucide-react';
import {getBaseModelName,getVehicleGenerationInfo,resolveVehicleGeneration} from '@/lib/vehicleGeneration';
interface VehicleIndexEntry {id:number;brand:string;model:string;year:string;slug:string;dnaScore:number}
export default function DnaSearchClient({index,initial}:{index:VehicleIndexEntry[];initial:{brand:string;model:string;year:string;fuel:string;transmission:string}}){
 const [brandInput,setBrandInput]=useState(initial.brand),[modelInput,setModelInput]=useState(initial.model),[vehicleYear,setVehicleYear]=useState(initial.year),[fuelType,setFuelType]=useState(initial.fuel),[transmissionType,setTransmissionType]=useState(initial.transmission);
 const router=useRouter();
 const years=Array.from({length:new Date().getFullYear()-1990+1},(_,i)=>String(new Date().getFullYear()-i));
 const getAllBrands=()=>[...new Set(index.map(vehicle=>vehicle.brand))].sort();
 const getModelsForBrand=(brand:string)=>[...new Set(index.filter(vehicle=>vehicle.brand===brand).map(vehicle=>getBaseModelName(vehicle.model)))].sort();
 const resolvedGeneration=brandInput&&modelInput&&vehicleYear?resolveVehicleGeneration(index,brandInput,modelInput,Number(vehicleYear)):null;
 const handleSearch=()=>{const query=new URLSearchParams({brand:brandInput,model:modelInput,year:vehicleYear,fuel:fuelType,transmission:transmissionType});router.push('/arac-dna?'+query.toString());};
 return (                        <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        padding: '32px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Search size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                Araç Bilgilerini Girin
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                            {/* Brand Select */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                                    Marka
                                </label>
                                <select
                                    value={brandInput}
                                    onChange={(e) => {
                                        setBrandInput(e.target.value);
                                        setModelInput(""); // Reset model when brand changes
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Marka Seçiniz</option>
                                    {getAllBrands().map(brand => (
                                        <option key={brand} value={brand} style={{ color: 'black' }}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Model Select */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                                    Model
                                </label>
                                <select
                                    value={modelInput}
                                    onChange={(e) => setModelInput(e.target.value)}
                                    disabled={!brandInput}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: !brandInput ? 'var(--secondary)' : 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: !brandInput ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: !brandInput ? 0.7 : 1,
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => !brandInput ? null : e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => !brandInput ? null : e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Model Seçiniz</option>
                                    {brandInput && getModelsForBrand(brandInput).map(model => (
                                        <option key={model} value={model} style={{ color: 'black' }}>{model}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehicle Year */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} />
                                    Araç Yılı
                                </label>
                                <select
                                    value={vehicleYear}
                                    onChange={(e) => setVehicleYear(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Seçiniz</option>
                                    {years.map(year => (
                                        <option key={year} value={year} style={{ color: 'black' }}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Zap size={14} />
                                    Yakıt Tipi
                                </label>
                                <select
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Tümü</option>
                                    <option value="Benzin" style={{ color: 'black' }}>Benzin</option>
                                    <option value="Dizel" style={{ color: 'black' }}>Dizel</option>
                                    <option value="Elektrik" style={{ color: 'black' }}>Elektrik</option>
                                    <option value="Hibrit" style={{ color: 'black' }}>Hibrit</option>
                                </select>
                            </div>

                            {/* Transmission Type */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                    Vites Tipi
                                </label>
                                <select
                                    value={transmissionType}
                                    onChange={(e) => setTransmissionType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'var(--input-bg)',
                                        border: '2px solid var(--input-border)',
                                        borderRadius: '12px',
                                        color: 'var(--foreground)',
                                        fontSize: '15px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--input-border)'}
                                >
                                    <option value="" style={{ color: 'black' }}>Tümü</option>
                                    <option value="Manuel" style={{ color: 'black' }}>Manuel</option>
                                    <option value="Otomatik" style={{ color: 'black' }}>Otomatik</option>
                                </select>
                            </div>
                        </div>

                        {brandInput && modelInput && vehicleYear && (
                            <div className="dna-generation-resolution">
                                <CheckCircle2 size={18} />
                                {resolvedGeneration ? <span><strong>{vehicleYear} için otomatik eşleşme:</strong> {resolvedGeneration.brand} {getVehicleGenerationInfo(resolvedGeneration).label} · {resolvedGeneration.year}</span> : <span>Bu marka, model ve yıl için doğrulanmış jenerasyon henüz bulunamadı.</span>}
                            </div>
                        )}

                        <button
                            onClick={handleSearch}
                            disabled={!brandInput || !modelInput || !vehicleYear}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                background: (!brandInput || !modelInput || !vehicleYear) ? 'var(--secondary)' : 'var(--primary)',
                                color: (!brandInput || !modelInput || !vehicleYear) ? 'var(--text-muted)' : 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: (!brandInput || !modelInput || !vehicleYear) ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                                opacity: (!brandInput || !modelInput || !vehicleYear) ? 0.5 : 1
                            }}
                        >
                            <Search size={20} />
                            DNA Analizi Ara
                        </button>
                    </div>

);
}
