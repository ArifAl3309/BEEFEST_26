'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import SchoolMapSetup, { AddressBreakdown } from './SchoolMapSetup'
import DeviceVerificationStep from './DeviceVerificationStep'
import { AlertCircle } from 'lucide-react'

export default function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [schoolName, setSchoolName] = useState('')
  const [addressData, setAddressData] = useState<AddressBreakdown>({
    street: '',
    rtRw: '',
    kelurahan: '',
    kecamatan: '',
    city: '',
    province: '',
  })
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [errorField, setErrorField] = useState('')

  // Validasi Step 1: Memeriksa field yang belum diisi dan memunculkan notif
  const handleProceedToStep2 = () => {
    if (!schoolName.trim()) {
      setValidationError('Nama Resmi Instansi / Sekolah wajib diisi.')
      setErrorField('schoolName')
      return
    }
    if (!addressData.street.trim()) {
      setValidationError('Nama Jalan / Gedung wajib diisi.')
      setErrorField('street')
      return
    }
    if (!addressData.kelurahan.trim()) {
      setValidationError('Kelurahan / Desa wajib diisi.')
      setErrorField('kelurahan')
      return
    }
    if (!addressData.kecamatan.trim()) {
      setValidationError('Kecamatan wajib diisi.')
      setErrorField('kecamatan')
      return
    }
    if (!addressData.city.trim()) {
      setValidationError('Kota / Kabupaten wajib diisi.')
      setErrorField('city')
      return
    }
    if (!addressData.province.trim()) {
      setValidationError('Provinsi wajib diisi.')
      setErrorField('province')
      return
    }

    setValidationError('')
    setErrorField('')
    setStep(2)
  }

  // Gabungkan seluruh komponen alamat menjadi satu string rapi
  const constructFullAddress = () => {
    const parts = [
      addressData.street.trim(),
      addressData.rtRw.trim(),
      addressData.kelurahan.trim() ? `Kel. ${addressData.kelurahan.trim()}` : '',
      addressData.kecamatan.trim() ? `Kec. ${addressData.kecamatan.trim()}` : '',
      addressData.city.trim(),
      addressData.province.trim(),
    ].filter(Boolean)

    return parts.join(', ')
  }

  const handleFinish = async () => {
    setLoading(true)
    const fullAddress = constructFullAddress()

    try {
      const res = await fetch('/api/onboarding/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          address: fullAddress,
          latitude: '-6.208800',
          longitude: '106.845600',
        }),
      })
      if (res.ok) {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Wizard */}
      <div className="border-b border-slate-800/80 pb-4">
        <h2 className="text-2xl font-black text-white tracking-tight">Setup Onboarding Sekolah</h2>
        <p className="text-sm text-slate-400 font-medium mt-1">Langkah {step} dari 2 — Konfigurasi Fasilitas & Titik Pemantauan</p>
      </div>

      {/* Notifikasi Error Validasi */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {step === 1 ? (
        <SchoolMapSetup
          schoolName={schoolName}
          setSchoolName={(val) => {
            setSchoolName(val)
            if (validationError) setValidationError('')
          }}
          addressData={addressData}
          setAddressData={(updater) => {
            setAddressData(updater)
            if (validationError) setValidationError('')
          }}
          errorField={errorField}
        />
      ) : (
        <DeviceVerificationStep />
      )}

      {/* Footer Actions (Anti-Orphan: Single Line Buttons) */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-slate-800/80">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-xs font-bold text-slate-400 hover:text-white whitespace-nowrap">
            Kembali
          </Button>
        ) : <div />}

        {step === 1 ? (
          <button
            type="button"
            onClick={handleProceedToStep2}
            className="px-6 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 active:scale-98 transition-all whitespace-nowrap flex items-center justify-center"
          >
            Lanjut ke Verifikasi Perangkat →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={loading}
            className="px-6 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-98 transition-all disabled:opacity-50 whitespace-nowrap flex items-center justify-center"
          >
            {loading ? 'Menyimpan Konfigurasi...' : 'Selesaikan & Buka Dashboard →'}
          </button>
        )}
      </div>
    </div>
  )
}
