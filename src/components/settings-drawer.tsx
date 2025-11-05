"use client";

import { Fragment } from "react";
import { Dialog, Transition, Listbox, Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/providers";
import type { CalculationMethod, HighLatitudeRule, JuristicMethod, LocationCoordinates } from "@/types";
import { availableLocales, type Locale } from "@/lib/i18n";
import { POPULAR_CITIES } from "@/lib/constants";
import clsx from "clsx";

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
  methods: CalculationMethod[];
  juristic: JuristicMethod[];
  highLatitude: HighLatitudeRule[];
  selectedMethodId: number;
  selectedJuristicId: number;
  selectedHighLatitudeId: number;
  onMethodChange: (id: number) => void;
  onJuristicChange: (id: number) => void;
  onHighLatitudeChange: (id: number) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  adhanEnabled: boolean;
  onAdhanToggle: (value: boolean) => void;
  onSelectLocation: (location: LocationCoordinates) => void;
};

export default function SettingsDrawer({
  open,
  onClose,
  methods,
  juristic,
  highLatitude,
  selectedMethodId,
  selectedJuristicId,
  selectedHighLatitudeId,
  onMethodChange,
  onJuristicChange,
  onHighLatitudeChange,
  locale,
  onLocaleChange,
  adhanEnabled,
  onAdhanToggle,
  onSelectLocation
}: SettingsDrawerProps) {
  const { t } = useTranslation();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <motion.div
                    className="flex h-full flex-col overflow-y-scroll bg-slate-900/95 shadow-2xl backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="px-6 py-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <Dialog.Title className="font-display text-2xl text-white">
                            {t("open_settings")}
                          </Dialog.Title>
                          <p className="mt-1 text-sm text-slate-300">
                            İbadet ritmini kişiselleştirin.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="rounded-full bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20"
                          onClick={onClose}
                        >
                          {t("close")}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-8 px-6 pb-10">
                      <section>
                        <h3 className="font-semibold text-white">{t("language")}</h3>
                        <Listbox value={locale} onChange={onLocaleChange}>
                          <div className="relative mt-4">
                            <Listbox.Button className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left text-white">
                              {
                                availableLocales.find((option) => option.code === locale)?.label ??
                                locale
                              }
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-slate-800/95 py-1 text-base text-white shadow-lg">
                                {availableLocales.map((option) => (
                                  <Listbox.Option
                                    key={option.code}
                                    value={option.code}
                                    className={({ active }) =>
                                      clsx(
                                        "cursor-pointer select-none px-4 py-2 text-sm",
                                        active ? "bg-emerald-400/20" : ""
                                      )
                                    }
                                  >
                                    {option.label}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </section>

                      <section>
                        <h3 className="font-semibold text-white">{t("calculation_method")}</h3>
                        <Listbox value={selectedMethodId} onChange={onMethodChange}>
                          <div className="relative mt-4">
                            <Listbox.Button className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left text-white">
                              {
                                methods.find((option) => option.id === selectedMethodId)?.name ??
                                selectedMethodId
                              }
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-slate-800/95 py-1 text-base text-white shadow-lg">
                                {methods.map((option) => (
                                  <Listbox.Option
                                    key={option.id}
                                    value={option.id}
                                    className={({ active }) =>
                                      clsx(
                                        "cursor-pointer select-none px-4 py-2 text-sm",
                                        active ? "bg-emerald-400/20" : ""
                                      )
                                    }
                                  >
                                    {option.name}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </section>

                      <section className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="font-semibold text-white">{t("juristic_method")}</h3>
                          <Listbox value={selectedJuristicId} onChange={onJuristicChange}>
                            <div className="relative mt-4">
                              <Listbox.Button className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left text-white">
                                {
                                  juristic.find((option) => option.id === selectedJuristicId)?.name ??
                                  selectedJuristicId
                                }
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-2 max-h-48 w-full overflow-auto rounded-xl border border-white/10 bg-slate-800/95 py-1 text-base text-white shadow-lg">
                                  {juristic.map((option) => (
                                    <Listbox.Option
                                      key={option.id}
                                      value={option.id}
                                      className={({ active }) =>
                                        clsx(
                                          "cursor-pointer select-none px-4 py-2 text-sm",
                                          active ? "bg-emerald-400/20" : ""
                                        )
                                      }
                                    >
                                      {option.name}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{t("high_latitude_rule")}</h3>
                          <Listbox value={selectedHighLatitudeId} onChange={onHighLatitudeChange}>
                            <div className="relative mt-4">
                              <Listbox.Button className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left text-white">
                                {
                                  highLatitude.find((option) => option.id === selectedHighLatitudeId)?.name ??
                                  selectedHighLatitudeId
                                }
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-2 max-h-48 w-full overflow-auto rounded-xl border border-white/10 bg-slate-800/95 py-1 text-base text-white shadow-lg">
                                  {highLatitude.map((option) => (
                                    <Listbox.Option
                                      key={option.id}
                                      value={option.id}
                                      className={({ active }) =>
                                        clsx(
                                          "cursor-pointer select-none px-4 py-2 text-sm",
                                          active ? "bg-emerald-400/20" : ""
                                        )
                                      }
                                    >
                                      {option.name}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>
                      </section>

                      <section>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{t("enable_adhan")}</h3>
                          <Switch
                            checked={adhanEnabled}
                            onChange={onAdhanToggle}
                            className={clsx(
                              adhanEnabled ? "bg-emerald-400" : "bg-white/20",
                              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition focus:outline-none"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={clsx(
                                adhanEnabled ? "translate-x-6 bg-emerald-950" : "translate-x-1 bg-white",
                                "pointer-events-none inline-block h-4 w-4 transform rounded-full transition"
                              )}
                            />
                          </Switch>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                          Otomatik ezan çalma ve yaklaşan vakit uyarıları.
                        </p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-white">{t("manual_location")}</h3>
                        <div className="mt-4 grid grid-cols-1 gap-3">
                          {POPULAR_CITIES.map((city) => (
                            <button
                              key={city.city}
                              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-emerald-400/20"
                              onClick={() =>
                                onSelectLocation({
                                  latitude: city.latitude,
                                  longitude: city.longitude,
                                  city: city.city,
                                  country: city.country
                                })
                              }
                            >
                              <p className="font-semibold">{city.city}</p>
                              <p className="text-xs text-white/70">{city.country}</p>
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
