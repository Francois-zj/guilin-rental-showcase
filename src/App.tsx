import { useEffect, useRef, useState } from 'react'
import { siteConfig, type ImageItem } from './data/site'

type IconName = 'arrow' | 'check' | 'chevronLeft' | 'chevronRight' | 'close' | 'copy' | 'location' | 'phone' | 'scooter' | 'up' | 'wechat' | 'wifi'

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
    close: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    copy: <><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>,
    scooter: <><circle cx="5" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M7.5 18h6l3-7h-6l-2 4H5l2-6h5"/><path d="m16 11-1-5h3"/><path d="M9 6h3"/></>,
    up: <><path d="m18 15-6-6-6 6"/><path d="M12 9v12"/></>,
    wechat: <><path d="M8.5 16.5c-3.6 0-6.5-2.4-6.5-5.4s2.9-5.4 6.5-5.4 6.5 2.4 6.5 5.4-2.9 5.4-6.5 5.4Z"/><path d="m5.3 15.7-2 1 .7-2.3"/><path d="M15 9.2c3.9 0 7 2.5 7 5.7 0 1.6-.8 3-2 4l.6 2.4-2.4-1.2c-1 .4-2 .6-3.2.6-3.9 0-7-2.6-7-5.8"/><path d="M6.8 10.3h.1M10.8 10.3h.1M13 14h.1M17.5 14h.1"/></>,
    wifi: <><path d="M5 12.6a10.7 10.7 0 0 1 14 0"/><path d="M8.5 16.1a5.5 5.5 0 0 1 7 0"/><path d="M2 9.2a15 15 0 0 1 20 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Gallery({ images, title, onOpen }: { images: readonly ImageItem[]; title: string; onOpen: (images: readonly ImageItem[], index: number) => void }) {
  return <div className="gallery" aria-label={`${title}实拍照片`}>
    {images.map((image, index) => <button className={index === 0 ? 'gallery-item gallery-item-main' : 'gallery-item'} key={image.src} onClick={() => onOpen(images, index)} aria-label={`放大查看：${image.alt}`}>
      <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} onError={(event) => { event.currentTarget.parentElement?.classList.add('image-error') }} />
      <span className="zoom-hint">查看大图</span>
    </button>)}
  </div>
}

function Lightbox({ images, index, onIndex, onClose }: { images: readonly ImageItem[]; index: number; onIndex: (index: number) => void; onClose: () => void }) {
  const touchStart = useRef<number | null>(null)
  const move = (direction: number) => onIndex((index + direction + images.length) % images.length)
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handle)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handle) }
  })
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label="房屋照片查看器" onClick={onClose} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }} onTouchEnd={(event) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1)
    touchStart.current = null
  }}>
    <button className="lightbox-close" onClick={onClose} aria-label="关闭图片"><Icon name="close" /></button>
    <button className="lightbox-nav lightbox-prev" onClick={(event) => { event.stopPropagation(); move(-1) }} aria-label="上一张"><Icon name="chevronLeft" size={28} /></button>
    <figure onClick={(event) => event.stopPropagation()}>
      <img src={images[index].src} alt={images[index].alt} />
      <figcaption><span>{images[index].alt}</span><span>{index + 1} / {images.length}</span></figcaption>
    </figure>
    <button className="lightbox-nav lightbox-next" onClick={(event) => { event.stopPropagation(); move(1) }} aria-label="下一张"><Icon name="chevronRight" size={28} /></button>
  </div>
}

function App() {
  const [lightbox, setLightbox] = useState<{ images: readonly ImageItem[]; index: number } | null>(null)
  const [toast, setToast] = useState('')
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const copy = async (text: string, message: string) => {
    try { await navigator.clipboard.writeText(text); showToast(message) }
    catch {
      const input = document.createElement('textarea'); input.value = text; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove(); showToast(message)
    }
  }
  const openGallery = (images: readonly ImageItem[], index: number) => setLightbox({ images, index })

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="返回首页"><span className="brand-mark">茶江路</span><span>房屋出租</span></a>
      <nav aria-label="页面导航"><a href="#rooms">户型</a><a href="#amenities">配套</a><a href="#location">位置</a></nav>
      <a className="header-call" href={`tel:${siteConfig.phone}`}><Icon name="phone" size={18} /> 联系房东</a>
    </header>

    <main id="top">
      <section className="hero">
        <img className="hero-image" src="./images/building/房屋外观.jpg" alt="桂林茶江路房屋建筑外观实拍" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light"><Icon name="location" size={16} /> 桂林市雁山区 · 雁山镇茶江路</p>
          <h1>{siteConfig.name}</h1>
          <p className="hero-subtitle">{siteConfig.subtitle}</p>
          <div className="hero-actions"><a className="button button-primary" href="#rooms">查看户型 <Icon name="arrow" size={18} /></a><a className="button button-glass" href={`tel:${siteConfig.phone}`}><Icon name="phone" size={18} /> 联系房东</a></div>
          <div className="hero-proof"><span>真实房屋照片</span><span>两种居住空间</span><span>配套信息透明</span></div>
        </div>
      </section>

      <section className="intro section-shell" id="rooms">
        <div className="section-heading"><div><p className="eyebrow">选择适合你的空间</p><h2>两种户型，按生活需要选择</h2></div><p>所有照片均为房屋实拍。点击图片可以放大查看，具体房间布局和家具配置以实际看房为准。</p></div>
        <div className="room-overview">
          {siteConfig.rooms.map((room) => <a href={`#${room.id}`} className="room-card" key={room.id}>
            <img src={room.images[0].src} alt={room.images[0].alt} loading="lazy" />
            <div className="room-card-shade" />
            <div className="room-card-content"><span>{room.eyebrow}</span><h3>{room.title}</h3><strong>{room.badge}</strong><p>{room.summary}</p><em>查看实拍 <Icon name="arrow" size={17} /></em></div>
          </a>)}
        </div>
      </section>

      <section className="amenities" id="amenities">
        <div className="section-shell amenities-inner">
          <div className="amenities-heading"><p className="eyebrow">房东已确认 · 免费提供</p><h2>生活配套 · 省心方便</h2></div>
          <div className="amenity-grid">
            {siteConfig.amenities.map((item) => <article className="amenity-card" key={item.title}><span className="amenity-icon"><Icon name={item.icon} size={28} /></span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}
          </div>
        </div>
      </section>

      {siteConfig.rooms.map((room, roomIndex) => <section className={`room-detail section-shell ${roomIndex % 2 ? 'room-detail-alt' : ''}`} id={room.id} key={room.id}>
        <div className="room-copy"><p className="eyebrow">{room.eyebrow}</p><h2>{room.title} <b aria-hidden="true">·</b> <span>{room.badge}</span></h2><p className="room-summary">{room.summary}不同房间的具体家具和设备可能存在差异，请以实际看房为准。</p>
          <ul>{room.features.map((feature) => <li key={feature}><span><Icon name="check" size={16} /></span>{feature}</li>)}</ul>
          <a className="text-link" href={`tel:${siteConfig.phone}`}>咨询这类户型 <Icon name="arrow" size={18} /></a>
        </div>
        <Gallery images={room.images} title={room.title} onOpen={openGallery} />
      </section>)}

      <section className="environment">
        <div className="section-shell"><div className="section-heading"><div><p className="eyebrow">建筑与公共区域</p><h2>从外观到过道，提前看看</h2></div><p>房屋位于桂林市雁山区雁山镇茶江路。楼上可由一楼通道或建筑后门进入。</p></div>
          <div className="environment-grid">{siteConfig.environment.map((image, index) => <button key={image.src} onClick={() => openGallery(siteConfig.environment, index)} aria-label={`放大查看：${image.alt}`}><img src={image.src} alt={image.alt} loading="lazy"/><span>{index === 0 ? '房屋外观' : '公共过道'} · 实拍</span></button>)}</div>
        </div>
      </section>

      <section className="location section-shell" id="location">
        <div className="location-card">
          <div className="location-icon"><Icon name="location" size={28} /></div>
          <div className="location-copy"><p className="eyebrow">房屋位置</p><h2>雁山镇茶江路</h2><p>{siteConfig.address}</p><small>附近定位参考：{siteConfig.nearby}</small></div>
          <div className="location-actions"><button className="button button-secondary" onClick={() => copy(siteConfig.address, '地址已复制')}><Icon name="copy" size={18} /> 复制地址</button><a className="button button-dark" href={siteConfig.mapUrl} target="_blank" rel="noreferrer"><Icon name="location" size={18} /> 查看地图</a></div>
        </div>
        <p className="map-note">地图将按附近定位名称搜索；若未自动打开地图应用，可复制地址后在常用地图中搜索。</p>
      </section>

      <section className="contact" id="contact">
        <div className="contact-inner section-shell">
          <div className="contact-heading"><p className="eyebrow light">看过照片，下一步</p><h2>联系房东咨询看房</h2><p>具体租金及房间情况，请直接联系房东确认。</p></div>
          <div className="contact-details"><span>电话 / 微信</span><strong>{siteConfig.phone}</strong><div><a className="button button-light" href={`tel:${siteConfig.phone}`}><Icon name="phone" size={19}/> 拨打电话</a><button className="button button-outline-light" onClick={() => copy(siteConfig.wechat, '微信号已复制，请打开微信添加房东咨询。')}><Icon name="wechat" size={20}/> 复制微信号</button></div></div>
          <article className="wechat-qr-card">
            <div className="wechat-qr-heading"><span className="wechat-qr-icon"><Icon name="wechat" size={21}/></span><div><h3>微信扫码咨询</h3><p>微信号：{siteConfig.wechat}</p></div></div>
            <button className="wechat-qr-button" onClick={() => openGallery([siteConfig.wechatQr], 0)} aria-label="放大查看房东微信好友二维码">
              <img src={siteConfig.wechatQr.src} alt={siteConfig.wechatQr.alt} loading="lazy" />
              <span>点击放大查看</span>
            </button>
            <p className="wechat-qr-caption">微信扫一扫，添加房东好友，咨询房屋详情。</p>
            <small>如无法直接识别二维码，请复制微信号，在微信中搜索添加。</small>
          </article>
        </div>
      </section>
    </main>

    <footer><span>桂林茶江路房屋出租</span><p>房屋实拍，具体情况以实际看房为准。</p><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="up" size={17}/> 返回顶部</button></footer>
    <div className="mobile-contact"><a href={`tel:${siteConfig.phone}`}><Icon name="phone" size={19}/> 拨打电话</a><button onClick={() => copy(siteConfig.wechat, '微信号已复制，请打开微信添加房东咨询。')}><Icon name="wechat" size={20}/> 复制微信</button></div>
    <div className={`toast ${toast ? 'toast-show' : ''}`} role="status" aria-live="polite">{toast}</div>
    {lightbox && <Lightbox images={lightbox.images} index={lightbox.index} onIndex={(index) => setLightbox({ ...lightbox, index })} onClose={() => setLightbox(null)} />}
  </>
}

export default App
