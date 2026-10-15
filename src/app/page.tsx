"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Clock3, Instagram, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { name: "Hair Styling", description: "Cuts, colour, styling and treatments.", price: "From ₹499", image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=900&q=85", alt: "Professional hair styling" },
  { name: "Skin Rituals", description: "Facials, glow rituals and skin care.", price: "From ₹999", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85", alt: "Relaxing skincare treatment" },
  { name: "Makeup", description: "Soft glam, party and occasion makeup.", price: "From ₹2,999", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=85", alt: "Professional makeup look" },
  { name: "Nail Care", description: "Manicures, pedicures and nail art.", price: "From ₹499", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85", alt: "Elegant manicure and nail art" },
];
const gallery = [
  { title: "Bridal glow", tag: "Bridal", image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=800&q=85" },
  { title: "The perfect finish", tag: "Hair", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85" },
  { title: "Soft glam", tag: "Makeup", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=85" },
  { title: "Nail details", tag: "Nails", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85" },
  { title: "Skin, softly", tag: "Skin", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85" },
];
const chapters = [
  { number: "01", eyebrow: "SKIN", title: ["A little time,", "just for you."], text: "Thoughtful skin rituals and restorative treatments, designed around the way you want to feel.", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=90" },
  { number: "02", eyebrow: "HAIR", title: ["Your signature,", "beautifully styled."], text: "From a fresh cut to a special-occasion finish, find the style that feels entirely yours.", image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1400&q=90" },
  { number: "03", eyebrow: "MAKEUP", title: ["Made to feel", "like yourself."], text: "Considered colour, soft detail and artistry that lets your own beauty take the lead.", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=90" },
];
const testimonials = [
  { quote: "The team made me feel so comfortable. My bridal look felt like me, only a little more magical.", name: "Priya S.", detail: "Bridal client", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
  { quote: "Such a thoughtful experience, from the consultation to the final result. I left feeling wonderful.", name: "Neha K.", detail: "Regular client", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80" },
  { quote: "Beautiful atmosphere and lovely attention to detail. It has become my go-to salon.", name: "Ananya M.", detail: "Hair & skin client", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80" },
];

function useGsapReveals(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.fromTo(node, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: node, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((node) => {
        gsap.fromTo(node, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", scrub: 0.7 } });
      });
    }, element);
    return () => ctx.revert();
  }, [root]);
}

function ScrollStory() {
  const storyRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = storyRef.current;
    const image = imageRef.current;
    const heading = headingRef.current;
    const copy = copyRef.current;
    if (!section || !image || !heading || !copy || prefersReducedMotion || mobile) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section, start: "top top", end: "+=210%", pin: true, scrub: 0.65, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
        },
      });
      tl.to([heading, copy], { autoAlpha: 0, y: -18, duration: 0.12 }, 0.28)
        .to(image, { scale: 1.12, xPercent: -2, duration: 0.25, ease: "none" }, 0.28)
        .set([heading, copy], { y: 18 }, 0.44).to(image, { autoAlpha: 0, duration: 0.06 }, 0.44)
        .call(() => setActive(1), [], 0.46)
        .set(image, { attr: { src: chapters[1].image, alt: "Hair styling editorial" }, xPercent: 2, scale: 1.02 }, 0.47)
        .to(image, { autoAlpha: 1, xPercent: 0, scale: 1.1, duration: 0.18 }, 0.49)
        .to([heading, copy], { autoAlpha: 1, y: 0, duration: 0.14 }, 0.51)
        .to([heading, copy], { autoAlpha: 0, y: -18, duration: 0.12 }, 0.68)
        .to(image, { autoAlpha: 0, scale: 1.05, duration: 0.06 }, 0.78)
        .call(() => setActive(2), [], 0.8)
        .set(image, { attr: { src: chapters[2].image, alt: "Makeup artistry editorial" }, xPercent: -2, scale: 1.01 }, 0.81)
        .to(image, { autoAlpha: 1, xPercent: 0, scale: 1.1, duration: 0.15 }, 0.83)
        .to([heading, copy], { autoAlpha: 1, y: 0, duration: 0.14 }, 0.84);
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion, mobile]);

  const chapterCards = <div className="services-grid" style={{ marginTop: 34 }}>{chapters.map((ch) => <article className="service-card" key={ch.number}><div className="service-image-wrap"><img className="service-image" src={ch.image} alt={ch.eyebrow} loading="lazy" /></div><div className="service-info"><div className="eyebrow section-kicker">{ch.eyebrow}</div><h3>{ch.title.join(" ")}</h3><p>{ch.text}</p></div></article>)}</div>;
  if (prefersReducedMotion || mobile) return <section className="section-pad" id="rituals"><div className="container"><div className="section-kicker eyebrow">THE MAISON BELLE RITUAL</div><h2 className="section-title serif">Little rituals.<br /><em>Lasting confidence.</em></h2>{chapterCards}</div></section>;

  const current = chapters[active];
  return <section ref={storyRef} className="story-section" id="rituals" aria-label="Explore our beauty rituals"><div className="story-frame"><div className="story-visual"><img ref={imageRef} className="story-image" src={chapters[0].image} alt="Skincare treatment editorial" /><div className="story-image-shade" /><span className="story-counter">A MOMENT FOR YOU&nbsp;&nbsp; / &nbsp;&nbsp;0{active + 1}</span><span className="story-vertical">THE ART OF FEELING YOURSELF</span></div><div className="story-copy"><div className="chapter-label"><span>{current.number}</span>{current.eyebrow} RITUAL</div><h2 ref={headingRef} className="story-title serif">{current.title.map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h2><p ref={copyRef} className="story-description">{current.text}</p><a className="text-link" href="#services">Discover the services <ArrowUpRight size={16} /></a><div className="story-progress" aria-label={`Chapter ${active + 1} of 3`}>{chapters.map((ch, i) => <div key={ch.number} className={i === active ? "story-progress-item active" : "story-progress-item"}><span>0{i + 1}</span><div><i /></div></div>)}</div></div></div></section>;
}

export default function HomePage() {
  const pageRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useGsapReveals(pageRef);
  const wa = "https://wa.me/910000000000?text=" + encodeURIComponent("Hello Maison Belle, I'd like to enquire about your services.");
  const nav = [{ label: "Services", href: "#services" }, { label: "Experience", href: "#rituals" }, { label: "Gallery", href: "#gallery" }, { label: "Our Story", href: "#about" }, { label: "Visit", href: "#visit" }];

  return <main ref={pageRef}>
    <header className={menuOpen ? "site-header menu-open" : "site-header"}><div className="container nav-inner"><a className="wordmark" href="#home" aria-label="Maison Belle home">MAISON BELLE<small>BEAUTY · HAIR · BRIDAL</small></a><nav className="nav-links" aria-label="Main navigation">{nav.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}<a className="pill pill-light" href="#visit">Enquire / Book <ArrowUpRight size={14} /></a></nav><button className="menu-toggle" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">{nav.map(item => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<a href="#visit" onClick={() => setMenuOpen(false)}>Enquire / Book ↗</a></nav>}</header>
    <section className="hero" id="home"><img className="hero-media" data-parallax src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=2200&q=90" alt="Luxury beauty editorial portrait" fetchPriority="high" /><div className="hero-shade" /><motion.div className="hero-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}><div className="hero-overline eyebrow">YOUR PRIVATE BEAUTY RITUAL</div><h1 className="hero-title serif">Your Beauty.<br /><em>Your Moment.</em></h1><p className="hero-intro">Thoughtful beauty, hair, skin and bridal experiences made around you. A little time to feel entirely yourself.</p><div className="hero-actions"><a className="pill pill-light" href="#services">Explore Services <ArrowDownRight size={15} /></a><a className="pill" style={{ borderColor: "rgba(255,255,255,.65)", color: "white" }} href={wa} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Enquire on WhatsApp</a></div><div className="hero-bottom"><div className="hero-stat"><strong>Thoughtful</strong><span>Personalised care</span></div><div className="hero-stat"><strong>Beautiful</strong><span>Every little detail</span></div><div className="hero-stat"><strong>Yours</strong><span>Your moment, your way</span></div></div></motion.div><div className="scroll-cue">Scroll to explore <ArrowDown size={13} /></div></section>
    <div className="container"><div className="trust-strip" aria-label="Our approach">{[["✳", "Thoughtful care", "Made around you"], ["♡", "Considered products", "Chosen with care"], ["✧", "Personalised looks", "Your style, always"], ["◇", "Warm welcome", "A moment to unwind"]].map(([symbol, title, subtitle]) => <div className="trust-item" key={title}><span className="trust-mark" aria-hidden="true">{symbol}</span><span><strong>{title}</strong><br /><span className="muted">{subtitle}</span></span></div>)}</div></div>
    <section className="section-pad" id="services"><div className="container"><div className="section-heading-row" data-reveal><div><div className="section-kicker eyebrow">OUR SERVICES</div><h2 className="section-title serif">Beauty care for<br /><em>every version of you.</em></h2></div><p className="muted" style={{ maxWidth: 280, lineHeight: 1.8, fontSize: ".8rem" }}>Considered treatments, thoughtful detail and a little space to make time for yourself.</p></div><div className="services-grid">{services.map(service => <motion.article className="service-card" key={service.name} data-reveal whileHover={{ y: -5 }} transition={{ duration: .25 }}><div className="service-image-wrap"><img className="service-image" src={service.image} alt={service.alt} loading="lazy" /></div><div className="service-info"><h3>{service.name}</h3><p>{service.description}</p><div className="service-foot"><span>{service.price} <small style={{ fontWeight: 400, color: "var(--muted)" }}>*demo</small></span><a className="circle-arrow" href={wa} target="_blank" rel="noreferrer" aria-label={`Enquire about ${service.name}`}><ArrowUpRight size={15} /></a></div></div></motion.article>)}</div><div className="center-action"><a className="pill pill-dark" href={wa} target="_blank" rel="noreferrer">Ask about a service <ArrowRight size={15} /></a></div></div></section>
    <ScrollStory />
    <section className="section-pad gallery" id="gallery"><div className="container"><div className="gallery-head" data-reveal><div><div className="section-kicker eyebrow">A LITTLE INSPIRATION</div><h2 className="section-title serif">The beauty of<br /><em>being yourself.</em></h2></div><p className="muted" style={{ maxWidth: 240, fontSize: ".78rem", lineHeight: 1.8 }}>A visual moodboard for your next little transformation.</p></div></div><div className="container gallery-row">{gallery.map(item => <motion.figure className="gallery-cell" key={item.title} data-reveal whileHover={{ y: -7 }} transition={{ duration: .28 }}><img className="gallery-image" src={item.image} alt={item.title} loading="lazy" /><figcaption className="gallery-caption"><span className="muted">{item.tag} / </span>{item.title}</figcaption></motion.figure>)}</div><div className="container center-action"><span className="muted" style={{ fontSize: ".66rem" }}>Concept imagery · Replace with the salon's own portfolio before launch</span></div></section>
    <section className="section-pad" id="about"><div className="container about-grid"><div className="about-image-wrap" data-reveal><img className="about-image" data-parallax src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1300&q=90" alt="Warm, considered salon interior" loading="lazy" /><div className="about-note"><strong>Made for you.</strong><span className="muted" style={{ fontSize: ".7rem", lineHeight: 1.6 }}>Not just a service. A moment that feels like yours.</span></div></div><div className="about-copy" data-reveal><div className="section-kicker eyebrow">THE MAISON BELLE APPROACH</div><h2 className="section-title serif">More than a salon.<br /><em>A beauty ritual.</em></h2><p>We believe beauty is personal. It is in the small details, the thoughtful consultation and the feeling of being truly looked after. Maison Belle is a concept for a warm, considered studio where every visit makes space for you.</p><p>From everyday care to your most meaningful occasions, our goal is simple: help you leave feeling like yourself, at your most confident.</p><div className="value-list"><span>Personalised care</span><span>Thoughtful details</span><span>Your style comes first</span></div><a className="pill pill-dark" href="#visit">Come say hello <ArrowRight size={15} /></a></div></div></section>
    <section className="section-pad bridal" id="bridal"><div className="container bridal-grid"><div className="bridal-copy" data-reveal><div className="section-kicker eyebrow">FOR YOUR MOST BEAUTIFUL DAYS</div><h2 className="section-title serif">Make your day<br /><em>truly unforgettable.</em></h2><p>From intimate celebrations to the big day, explore a personalised bridal experience shaped around your look, your story and your comfort.</p><ul className="bridal-list"><li>Bridal and occasion makeup</li><li>Hair styling and draping</li><li>Pre-event beauty rituals</li><li>Personalised consultation</li></ul><a className="pill pill-rose" href={wa} target="_blank" rel="noreferrer">Enquire about bridal <ArrowUpRight size={15} /></a></div><div className="bridal-image-wrap" data-reveal><img className="bridal-image" src="https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=1200&q=90" alt="Bridal beauty editorial inspiration" loading="lazy" /></div></div></section>
    <section className="section-pad" id="testimonials"><div className="container"><div data-reveal style={{ textAlign: "center", marginBottom: 45 }}><div className="section-kicker eyebrow">KIND WORDS</div><h2 className="section-title serif" style={{ marginInline: "auto" }}>A little love,<br /><em>from our guests.</em></h2><p className="muted" style={{ fontSize: ".7rem", marginTop: 18 }}>Illustrative testimonials for the concept — replace with approved client reviews.</p></div><div className="testimonials-grid">{testimonials.map(t => <motion.article className="quote-card" data-reveal key={t.name} whileHover={{ y: -4 }}><div className="stars" aria-label="Illustrative five-star rating">★★★★★</div><blockquote>“{t.quote}”</blockquote><div className="quote-person"><img className="avatar" src={t.image} alt="" loading="lazy" /><span><strong>{t.name}</strong><br /><span className="muted">{t.detail} · concept</span></span></div></motion.article>)}</div></div></section>
    <section className="section-pad" id="visit"><div className="container visit-grid"><div data-reveal><div className="section-kicker eyebrow">YOUR MOMENT AWAITS</div><h2 className="section-title serif">We'd love<br /><em>to see you.</em></h2><p className="muted" style={{ fontSize: ".82rem", lineHeight: 1.8, maxWidth: 350 }}>Have a question about a service or planning something special? Get in touch and we'll help you find the right experience.</p><div className="visit-details"><div className="detail-row"><span className="detail-icon"><MapPin size={17} /></span><span><strong>Visit the studio</strong><br /><span className="muted">Add the salon's verified address here</span></span></div><div className="detail-row"><span className="detail-icon"><Clock3 size={17} /></span><span><strong>Opening hours</strong><br /><span className="muted">Replace with confirmed opening hours</span></span></div><div className="detail-row"><span className="detail-icon"><Phone size={17} /></span><span><strong>Let's talk</strong><br /><span className="muted">Demo WhatsApp number — replace before launch</span></span></div></div><a className="pill pill-dark" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Enquire on WhatsApp <ArrowUpRight size={15} /></a></div><div className="map-card" data-reveal><img src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85" alt="Architectural detail placeholder for salon location" loading="lazy" /><div className="map-label"><span><strong>Come find your moment.</strong><br /><span className="muted" style={{ fontSize: ".67rem" }}>Map and directions will be added for the real salon.</span></span><span className="circle-arrow"><MapPin size={16} /></span></div></div></div></section>
    <footer className="footer"><div className="container"><div className="footer-grid"><div><a className="wordmark" href="#home">MAISON BELLE<small>BEAUTY · HAIR · BRIDAL</small></a><p>A considered beauty experience, made around you. This is a demo concept; details and imagery are illustrative.</p><a href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a> <a style={{ marginLeft: 13 }} href="#gallery" aria-label="Instagram gallery"><Instagram size={18} /></a></div><div className="footer-col"><h4>Explore</h4>{nav.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}</div><div className="footer-col"><h4>Our services</h4>{services.map(service => <a href="#services" key={service.name}>{service.name}</a>)}<a href="#bridal">Bridal experiences</a></div><div className="footer-col"><h4>Say hello</h4><a href={wa} target="_blank" rel="noreferrer">WhatsApp enquiries</a><a href="#visit">Location & hours</a><a href="#visit">Appointment information</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Maison Belle · Concept website</span><span>Illustrative content · Replace with verified business details</span></div></div></footer>
  </main>;
}