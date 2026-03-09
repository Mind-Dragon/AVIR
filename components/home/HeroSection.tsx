export default function HeroSection() {
  return (
    <section className="hero-video__wrapper" data-wf-class="hero-video__wrapper">
      {/* Full-viewport autoplay video — no text overlay, matching avir.com */}
      <div className="hero-video__bg">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video__element"
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Subtle dark overlay to match original site feel */}
      <div className="hero-overlay" aria-hidden="true" />
    </section>
  );
}
