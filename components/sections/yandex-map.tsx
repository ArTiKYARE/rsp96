"use client";

export function YandexMap() {
  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-xl bg-muted">
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3Ac3e21e7921feb6437f91f950c1432c2128896c6a9446f3f214aa6f31093da76f&lang=ru_RU&scroll=true&source=constructor-api"
        width="100%"
        height="400"
        frameBorder="0"
        allowFullScreen
        className="w-full h-full border-0"
        title="Офис РСП на карте"
      />
    </div>
  );
}
