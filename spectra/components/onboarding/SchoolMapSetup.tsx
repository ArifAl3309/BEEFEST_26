'use client'

import { MapPin } from 'lucide-react'

export interface AddressBreakdown {
  street: string
  rtRw: string
  kelurahan: string
  kecamatan: string
  city: string
  province: string
}

interface MapSetupProps {
  schoolName: string
  setSchoolName: (val: string) => void
  addressData: AddressBreakdown
  setAddressData: (updater: (prev: AddressBreakdown) => AddressBreakdown) => void
  errorField?: string
}

export default function SchoolMapSetup({
  schoolName,
  setSchoolName,
  addressData,
  setAddressData,
  errorField,
}: MapSetupProps) {
  const updateField = (field: keyof AddressBreakdown, value: string) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Kelompok Nama Resmi Instansi */}
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor="onboard-school-name" className="text-xs font-bold text-slate-300 flex justify-between">
          <span>Nama Resmi Instansi / Sekolah</span>
          <span className="text-[11px] text-slate-500 font-normal">Wajib</span>
        </label>
        <input
          id="onboard-school-name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="Contoh: SMAN 1 Jakarta"
          className={`w-full h-12 px-4 rounded-xl text-sm font-semibold bg-[#080C16] text-white border placeholder:text-slate-600 placeholder:opacity-60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all ${errorField === 'schoolName' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700/80'
            }`}
        />
      </div>

      {/* 2. Kelompok Alamat Terstruktur (Dalam Satu Section Card) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A]/80 border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <MapPin size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Alamat Sekolah
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Sistem akan otomatis menggabungkan seluruh komponen alamat gedung ini
            </p>
          </div>
        </div>

        {/* Row 1: Nama Jalan & RT/RW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="onboard-street" className="text-xs font-bold text-slate-300 flex justify-between">
              <span>Nama Jalan / Gedung</span>
              <span className="text-[11px] text-slate-500 font-normal">Wajib</span>
            </label>
            <input
              id="onboard-street"
              value={addressData.street}
              onChange={(e) => updateField('street', e.target.value)}
              placeholder="Contoh: Jl. Budi Utomo No.7"
              className={`w-full h-11 px-3.5 rounded-xl text-xs font-semibold bg-[#080C16] text-white border placeholder:text-slate-600 placeholder:opacity-60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all ${errorField === 'street' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700/80'
                }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="onboard-rtrw" className="text-xs font-bold text-slate-300">
              RT / RW
            </label>
            <input
              id="onboard-rtrw"
              value={addressData.rtRw}
              onChange={(e) => updateField('rtRw', e.target.value)}
              placeholder="Contoh: RT 02 / RW 05"
              className="w-full h-11 px-3.5 rounded-xl text-xs font-semibold bg-[#080C16] text-white border border-slate-700/80 placeholder:text-slate-600 placeholder:opacity-60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>
        </div>

        {/* Row 2: Kelurahan & Kecamatan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="onboard-kelurahan" className="text-xs font-bold text-slate-300 flex justify-between">
              <span>Kelurahan / Desa</span>
              <span className="text-[11px] text-slate-500 font-normal">Wajib</span>
            </label>
            <input
              id="onboard-kelurahan"
              value={addressData.kelurahan}
              onChange={(e) => updateField('kelurahan', e.target.value)}
              placeholder="Contoh: Pasar Baru"
              className={`w-full h-11 px-3.5 rounded-xl text-xs font-semibold bg-[#080C16] text-white border placeholder:text-slate-600 placeholder:opacity-60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all ${errorField === 'kelurahan' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700/80'
                }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="onboard-kecamatan" className="text-xs font-bold text-slate-300 flex justify-between">
              <span>Kecamatan</span>
              <span className="text-[11px] text-slate-500 font-normal">Wajib</span>
            </label>
            <input
              id="onboard-kecamatan"
              value={addressData.kecamatan}
              onChange={(e) => updateField('kecamatan', e.target.value)}
              placeholder="Contoh: Sawah Besar"
              className={`w-full h-11 px-3.5 rounded-xl text-xs font-semibold bg-[#080C16] text-white border placeholder:text-slate-600 placeholder:opacity-60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all ${errorField === 'kecamatan' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700/80'
                }`}
            />
          </div>
        </div>

        {/* Row 3: Kota/Kabupaten & Provinsi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="onboard-city" className="text-xs font-bold text-slate-300 flex justify-between">
              <span>Kota / Kabupaten</span>
              <span className="text-[11px] text-slate-500 font-normal">Wajib</span>
            </label>
            <input
              id="onboard-city"
              value={addressData.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="Contoh: Jakarta Pusat"
              className={`w-full h-11 px-3.5 rounded-xl text-xs font-semibold bg-[#080C16] text-white border placeholder:text-slate-600 placeholder:opacity-60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all ${errorField === 'city' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700/80'
                }`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="onboard-province" className="text-xs font-bold text-slate-300 flex justify-between">
              <span>Provinsi</span>
              <span className="text-[11px] text-slate-500 font-normal">Wajib</span>
            </label>
            <input
              id="onboard-province"
              value={addressData.province}
              onChange={(e) => updateField('province', e.target.value)}
              placeholder="Contoh: DKI Jakarta"
              className={`w-full h-11 px-3.5 rounded-xl text-xs font-semibold bg-[#080C16] text-white border placeholder:text-slate-600 placeholder:opacity-60 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all ${errorField === 'province' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700/80'
                }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
