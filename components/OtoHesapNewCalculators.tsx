"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Activity, Calculator, Circle, Fuel, Gauge, Route, Wallet, type LucideIcon } from "lucide-react";

const currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });

function positive(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function NumberField({ label, value, onChange, suffix, min = 0, step = 1, help }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
  help?: string;
}) {
  return (
    <label className="oh-calc-field">
      <span>{label}</span>
      <span className="oh-calc-input-wrap">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={event => onChange(Number(event.target.value))}
        />
        {suffix && <span className="oh-calc-suffix">{suffix}</span>}
      </span>
      {help && <small>{help}</small>}
    </label>
  );
}

function CalculatorShell({ icon: Icon, title, description, children }: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="oh-new-calculator">
      <header className="oh-calc-header">
        <span className="oh-calc-header-icon"><Icon size={22} strokeWidth={1.7} /></span>
        <div><h2>{title}</h2><p>{description}</p></div>
      </header>
      <div className="oh-calc-fields" aria-live="polite">{children}</div>
    </section>
  );
}

function Metric({ label, value, note, primary = false }: { label: string; value: string; note?: string; primary?: boolean }) {
  return (
    <div className={`oh-calc-metric${primary ? " primary" : ""}`}>
      <span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}
    </div>
  );
}

function Breakdown({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="oh-calc-breakdown">
      {rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  );
}

export function KmBasinaMaliyetCalculator() {
  const [monthlyKm, setMonthlyKm] = useState(1250);
  const [fuelPrice, setFuelPrice] = useState(48);
  const [consumption, setConsumption] = useState(7.2);
  const [insurance, setInsurance] = useState(18000);
  const [tax, setTax] = useState(6000);
  const [maintenance, setMaintenance] = useState(15000);
  const [other, setOther] = useState(9000);

  const result = useMemo(() => {
    const annualKm = positive(monthlyKm) * 12;
    const fuel = annualKm * positive(consumption) / 100 * positive(fuelPrice);
    const fixed = positive(insurance) + positive(tax) + positive(maintenance) + positive(other);
    const total = fuel + fixed;
    return { annualKm, fuel, fixed, total, perKm: annualKm ? total / annualKm : 0 };
  }, [monthlyKm, fuelPrice, consumption, insurance, tax, maintenance, other]);

  return (
    <CalculatorShell icon={Route} title="Kilometre başına gerçek araç gideriniz" description="Yakıtla birlikte sigorta, vergi, bakım ve diğer yıllık giderleri kilometreye dağıtır.">
      <NumberField label="Aylık kullanım" value={monthlyKm} onChange={setMonthlyKm} suffix="km" step={50} />
      <NumberField label="Yakıt litre fiyatı" value={fuelPrice} onChange={setFuelPrice} suffix="TL" step={0.1} />
      <NumberField label="Ortalama tüketim" value={consumption} onChange={setConsumption} suffix="lt/100 km" step={0.1} />
      <NumberField label="Yıllık sigorta ve kasko" value={insurance} onChange={setInsurance} suffix="TL" step={500} />
      <NumberField label="Yıllık MTV" value={tax} onChange={setTax} suffix="TL" step={250} />
      <NumberField label="Yıllık bakım ve lastik" value={maintenance} onChange={setMaintenance} suffix="TL" step={500} />
      <NumberField label="Park ve diğer giderler" value={other} onChange={setOther} suffix="TL" step={500} />
      <Metric label="Kilometre başı toplam maliyet" value={`${decimal.format(result.perKm)} TL/km`} note={`${decimal.format(result.annualKm)} km yıllık kullanım üzerinden`} primary />
      <div className="oh-calc-metric-grid">
        <Metric label="Aylık ortalama" value={currency.format(result.total / 12)} />
        <Metric label="Yıllık toplam" value={currency.format(result.total)} />
      </div>
      <Breakdown rows={[["Yıllık yakıt", currency.format(result.fuel)], ["Yıllık sabit gider", currency.format(result.fixed)]]} />
    </CalculatorShell>
  );
}

export function SahipOlmaMaliyetiCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(1250000);
  const [years, setYears] = useState(5);
  const [depreciation, setDepreciation] = useState(12);
  const [annualKm, setAnnualKm] = useState(15000);
  const [fuelPrice, setFuelPrice] = useState(48);
  const [consumption, setConsumption] = useState(7.2);
  const [annualFixed, setAnnualFixed] = useState(42000);

  const result = useMemo(() => {
    const period = Math.max(1, Math.round(positive(years)));
    const rate = Math.min(90, positive(depreciation)) / 100;
    const remaining = positive(vehiclePrice) * Math.pow(1 - rate, period);
    const valueLoss = Math.max(0, positive(vehiclePrice) - remaining);
    const annualFuel = positive(annualKm) / 100 * positive(consumption) * positive(fuelPrice);
    const operating = (annualFuel + positive(annualFixed)) * period;
    const total = valueLoss + operating;
    return { period, remaining, valueLoss, annualFuel, operating, total, yearly: total / period };
  }, [vehiclePrice, years, depreciation, annualKm, fuelPrice, consumption, annualFixed]);

  return (
    <CalculatorShell icon={Wallet} title="Aracın toplam sahip olma maliyeti" description="Satın alma fiyatına değil; değer kaybı ve kullanım giderlerinin tamamına bakar.">
      <NumberField label="Araç satın alma değeri" value={vehiclePrice} onChange={setVehiclePrice} suffix="TL" step={10000} />
      <NumberField label="Kullanım süresi" value={years} onChange={setYears} suffix="yıl" min={1} step={1} />
      <NumberField label="Yıllık değer kaybı" value={depreciation} onChange={setDepreciation} suffix="%" step={0.5} help="Her yıl kalan değer üzerinden bileşik hesaplanır." />
      <NumberField label="Yıllık kilometre" value={annualKm} onChange={setAnnualKm} suffix="km" step={500} />
      <NumberField label="Yakıt litre fiyatı" value={fuelPrice} onChange={setFuelPrice} suffix="TL" step={0.1} />
      <NumberField label="Ortalama tüketim" value={consumption} onChange={setConsumption} suffix="lt/100 km" step={0.1} />
      <NumberField label="Yıllık vergi, sigorta, bakım ve diğer" value={annualFixed} onChange={setAnnualFixed} suffix="TL" step={1000} />
      <Metric label={`${result.period} yıllık toplam sahip olma maliyeti`} value={currency.format(result.total)} note="Tahmini satış değeri dikkate alınarak" primary />
      <div className="oh-calc-metric-grid">
        <Metric label="Yıllık ortalama" value={currency.format(result.yearly)} />
        <Metric label="Aylık ortalama" value={currency.format(result.yearly / 12)} />
        <Metric label="Tahmini kalan değer" value={currency.format(result.remaining)} />
      </div>
      <Breakdown rows={[["Toplam değer kaybı", currency.format(result.valueLoss)], ["Dönem kullanım giderleri", currency.format(result.operating)], ["Bir yıllık yakıt", currency.format(result.annualFuel)]]} />
    </CalculatorShell>
  );
}

type FuelOption = { key: string; label: string; price: number; consumption: number; unit: string };

export function YakitTuruKarsilastirmaCalculator() {
  const [annualKm, setAnnualKm] = useState(15000);
  const [options, setOptions] = useState<FuelOption[]>([
    { key: "benzin", label: "Benzin", price: 48, consumption: 7.2, unit: "lt" },
    { key: "dizel", label: "Dizel", price: 49, consumption: 5.8, unit: "lt" },
    { key: "lpg", label: "LPG", price: 28, consumption: 9.5, unit: "lt" },
    { key: "elektrik", label: "Elektrik", price: 4, consumption: 17, unit: "kWh" },
  ]);

  const update = (key: string, field: "price" | "consumption", value: number) => {
    setOptions(current => current.map(option => option.key === key ? { ...option, [field]: value } : option));
  };
  const results = useMemo(() => options.map(option => {
    const perKm = positive(option.price) * positive(option.consumption) / 100;
    return { ...option, perKm, annual: perKm * positive(annualKm) };
  }).sort((a, b) => a.annual - b.annual), [options, annualKm]);
  const cheapest = results[0];

  return (
    <CalculatorShell icon={Fuel} title="Benzin, dizel, LPG ve elektrik maliyetini kıyaslayın" description="Kendi tüketim ve birim fiyatlarınızla dört enerji türünü aynı kilometrede karşılaştırır.">
      <NumberField label="Yıllık kullanım" value={annualKm} onChange={setAnnualKm} suffix="km" step={500} />
      <div className="oh-fuel-compare-inputs">
        {options.map(option => (
          <fieldset key={option.key}>
            <legend>{option.label}</legend>
            <NumberField label={`Birim fiyat (${option.unit})`} value={option.price} onChange={value => update(option.key, "price", value)} suffix="TL" step={0.1} />
            <NumberField label={`Tüketim (${option.unit}/100 km)`} value={option.consumption} onChange={value => update(option.key, "consumption", value)} suffix={option.unit} step={0.1} />
          </fieldset>
        ))}
      </div>
      <Metric label="Girilen değerlere göre en düşük maliyet" value={cheapest?.label || "—"} note={cheapest ? `${decimal.format(cheapest.perKm)} TL/km · yılda ${currency.format(cheapest.annual)}` : undefined} primary />
      <div className="oh-compare-table" role="table" aria-label="Yakıt türü maliyet karşılaştırması">
        {results.map((option, index) => (
          <div key={option.key} className={index === 0 ? "best" : ""} role="row">
            <span>{option.label}{index === 0 && <small>En düşük</small>}</span>
            <span>{decimal.format(option.perKm)} TL/km</span>
            <strong>{currency.format(option.annual)}</strong>
            <span>{index === 0 ? "Referans" : `+${currency.format(option.annual - cheapest.annual)}`}</span>
          </div>
        ))}
      </div>
      <p className="oh-calc-disclaimer">Araç satın alma fiyatı, bakım, vergi ve sigorta farkları bu karşılaştırmaya dahil değildir.</p>
    </CalculatorShell>
  );
}

type PowerUnit = "kw" | "ps" | "hp";

export function MotorGucuCalculator() {
  const [value, setValue] = useState(100);
  const [unit, setUnit] = useState<PowerUnit>("kw");
  const result = useMemo(() => {
    const input = positive(value);
    const kw = unit === "kw" ? input : unit === "ps" ? input / 1.3596216173 : input / 1.3410220896;
    return { kw, ps: kw * 1.3596216173, hp: kw * 1.3410220896 };
  }, [value, unit]);

  return (
    <CalculatorShell icon={Gauge} title="kW, PS ve HP motor gücü dönüştürme" description="Ruhsattaki kilovat değerini metrik beygir (PS) ve mekanik beygir (HP) karşılığına çevirir.">
      <div className="oh-unit-tabs" aria-label="Kaynak güç birimi">
        {(["kw", "ps", "hp"] as PowerUnit[]).map(item => <button type="button" key={item} className={unit === item ? "active" : ""} onClick={() => setUnit(item)}>{item.toUpperCase()}</button>)}
      </div>
      <NumberField label="Dönüştürülecek motor gücü" value={value} onChange={setValue} suffix={unit.toUpperCase()} step={0.1} />
      <Metric label="Motor gücü karşılıkları" value={`${decimal.format(result.ps)} PS`} note={`${decimal.format(result.kw)} kW · ${decimal.format(result.hp)} HP`} primary />
      <div className="oh-calc-metric-grid">
        <Metric label="Kilovat" value={`${decimal.format(result.kw)} kW`} />
        <Metric label="Metrik beygir" value={`${decimal.format(result.ps)} PS`} />
        <Metric label="Mekanik beygir" value={`${decimal.format(result.hp)} HP`} />
      </div>
      <Breakdown rows={[["1 kW", "1,3596 PS"], ["1 kW", "1,3410 HP"], ["100 PS", "73,55 kW"]]} />
    </CalculatorShell>
  );
}

type PressureUnit = "bar" | "psi" | "kpa";

export function LastikBasinciCalculator() {
  const [value, setValue] = useState(2.3);
  const [unit, setUnit] = useState<PressureUnit>("bar");
  const result = useMemo(() => {
    const input = positive(value);
    const bar = unit === "bar" ? input : unit === "psi" ? input / 14.5037738 : input / 100;
    return { bar, psi: bar * 14.5037738, kpa: bar * 100 };
  }, [value, unit]);

  return (
    <CalculatorShell icon={Circle} title="PSI, bar ve kPa lastik basıncı dönüştürme" description="Kapı içindeki, kullanım kılavuzundaki veya pompadaki basınç değerini üç birimde birlikte gösterir.">
      <div className="oh-unit-tabs" aria-label="Kaynak basınç birimi">
        {(["bar", "psi", "kpa"] as PressureUnit[]).map(item => <button type="button" key={item} className={unit === item ? "active" : ""} onClick={() => setUnit(item)}>{item.toUpperCase()}</button>)}
      </div>
      <NumberField label="Dönüştürülecek basınç" value={value} onChange={setValue} suffix={unit.toUpperCase()} step={unit === "kpa" ? 1 : 0.1} />
      <Metric label="Lastik basıncı karşılıkları" value={`${decimal.format(result.bar)} bar`} note={`${decimal.format(result.psi)} PSI · ${decimal.format(result.kpa)} kPa`} primary />
      <div className="oh-calc-metric-grid">
        <Metric label="Bar" value={`${decimal.format(result.bar)} bar`} />
        <Metric label="PSI" value={`${decimal.format(result.psi)} PSI`} />
        <Metric label="Kilopaskal" value={`${decimal.format(result.kpa)} kPa`} />
      </div>
      <div className="oh-calc-note"><Activity size={16} /><span>Doğru hedef basınç için araç üreticisinin sürücü kapısı içi etiketini veya kullanım kılavuzunu esas alın; lastik yanağındaki değer genellikle azami sınırdır.</span></div>
    </CalculatorShell>
  );
}
