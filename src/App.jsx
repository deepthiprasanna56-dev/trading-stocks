import { useMemo, useState } from 'react'
import './App.css'

/* ─── DATA ─── */
const stocks = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation',    price: 142.87, change:  3.42, color: '#76b900', mark: 'N', sector: 'Technology',  mktCap: '3.51T', pe: 54.2 },
  { symbol: 'AAPL', name: 'Apple Inc.',             price: 237.49, change:  1.18, color: '#bfc5d2', mark: '●', sector: 'Technology',  mktCap: '3.63T', pe: 31.8 },
  { symbol: 'TSLA', name: 'Tesla, Inc.',            price: 352.56, change: -2.16, color: '#ed5148', mark: 'T', sector: 'Automotive',  mktCap: '1.13T', pe: 97.4 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.32, change:  0.86, color: '#39a9ef', mark: '▦', sector: 'Technology',  mktCap: '3.09T', pe: 36.1 },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.',      price: 224.18, change:  2.71, color: '#f4a32e', mark: 'a', sector: 'Consumer',    mktCap: '2.37T', pe: 44.3 },
  { symbol: 'META', name: 'Meta Platforms, Inc.',  price: 589.42, change: -0.43, color: '#4888fb', mark: '∞', sector: 'Technology',  mktCap: '1.50T', pe: 27.6 },
]

const chartPoints = {
  '1D': '0,114 24,108 48,113 72,89 96,96 120,74 144,80 168,57 192,66 216,54 240,64 264,45 288,51 312,39 336,49 360,30 384,38 408,22 432,32 456,19 480,29 504,14 528,22 552,7 576,16 600,4',
  '1W': '0,113 24,102 48,108 72,91 96,99 120,77 144,88 168,64 192,70 216,55 240,73 264,49 288,59 312,33 336,40 360,28 384,39 408,18 432,31 456,16 480,30 504,11 528,22 552,5 576,19 600,7',
  '1M': '0,108 24,111 48,94 72,102 96,84 120,91 144,73 168,85 192,63 216,72 240,56 264,68 288,47 312,59 336,38 360,49 384,29 408,41 432,25 456,35 480,18 504,28 528,11 552,20 576,5 600,13',
  '1Y': '0,115 24,103 48,109 72,94 96,98 120,80 144,88 168,65 192,71 216,61 240,72 264,48 288,55 312,35 336,44 360,29 384,40 408,20 432,29 456,17 480,26 504,9 528,21 552,6 576,15 600,4',
}

const stockDetails = {
  NVDA: { exchange: 'NASDAQ', price: 142.87, change: 3.42,  diff: '+$4.72',  volume: '32.4M', range: '$138.11 – $143.22' },
  AAPL: { exchange: 'NASDAQ', price: 237.49, change: 1.18,  diff: '+$2.77',  volume: '58.1M', range: '$234.20 – $238.90' },
  TSLA: { exchange: 'NASDAQ', price: 352.56, change: -2.16, diff: '-$7.78',  volume: '91.3M', range: '$349.10 – $361.44' },
  MSFT: { exchange: 'NASDAQ', price: 415.32, change: 0.86,  diff: '+$3.54',  volume: '21.6M', range: '$411.00 – $416.50' },
  AMZN: { exchange: 'NASDAQ', price: 224.18, change: 2.71,  diff: '+$5.92',  volume: '34.7M', range: '$218.40 – $225.00' },
  META: { exchange: 'NASDAQ', price: 589.42, change: -0.43, diff: '-$2.56',  volume: '14.2M', range: '$584.10 – $592.80' },
}

const holdingShares = { NVDA: 12, AAPL: 8, MSFT: 6, AMZN: 10 }
const holdingValues = { NVDA: 1714.44, AAPL: 1899.92, MSFT: 2491.92, AMZN: 2241.80 }
const holdingCost   = { NVDA: 1420.00, AAPL: 1760.00, MSFT: 2340.00, AMZN: 2080.00 }

/* ─── ICON ─── */
function Icon({ name, size = 18 }) {
  const paths = {
    grid:      <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    chart:     <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
    clock:     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell:      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>,
    plus:      <path d="M12 5v14M5 12h14"/>,
    arrow:     <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    chevron:   <path d="m9 18 6-6-6-6"/>,
    down:      <path d="m7 10 5 5 5-5"/>,
    more:      <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    x:         <path d="M18 6 6 18M6 6l12 12"/>,
    trending:  <><path d="m22 7-9.5 9.5-5-5L2 17"/><path d="M16 7h6v6"/></>,
    shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    wallet:    <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></>,
    trash:     <><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function MiniChart({ down = false }) {
  const points = down
    ? '0,7 10,9 20,4 30,11 40,8 50,14 60,9 70,15 80,12 90,17 100,14'
    : '0,17 10,14 20,16 30,7 40,11 50,5 60,10 70,3 80,8 90,2 100,5'
  return (
    <svg className="mini-chart" viewBox="0 0 100 22" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={down ? '#f36c73' : '#42d6a0'} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
    </svg>
  )
}

/* ─── MODALS ─── */
function TradeModal({ stock, side, quantity, setQuantity, setSide, onSubmit, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="trade-modal" onSubmit={onSubmit} onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div><span className="panel-label">PLACE AN ORDER</span><h2>Trade {stock.symbol}</h2></div>
          <button type="button" className="icon-button" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <div className="trade-switch">
          <button type="button" className={side === 'Buy'  ? 'buy-active'  : ''} onClick={() => setSide('Buy')}>Buy</button>
          <button type="button" className={side === 'Sell' ? 'sell-active' : ''} onClick={() => setSide('Sell')}>Sell</button>
        </div>
        <label className="field-label">
          Quantity <span>Shares</span>
          <input type="number" min="1" step="1" required value={quantity} onChange={e => setQuantity(e.target.value)}/>
        </label>
        <div className="order-summary">
          <span>Market price</span><b>${stock.price.toFixed(2)}</b>
          <span>Estimated total</span><b>${(Number(quantity || 0) * stock.price).toLocaleString('en-US',{minimumFractionDigits:2})}</b>
        </div>
        <button className={`submit-order ${side === 'Sell' ? 'sell-button' : ''}`} type="submit">
          {side} {stock.symbol}
        </button>
        <p className="demo-notice">Demo mode · No real transaction will be made</p>
      </form>
    </div>
  )
}

function WatchModal({ filtered, watchlist, search, setSearch, toggleWatch, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="trade-modal watch-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div><span className="panel-label">YOUR WATCHLIST</span><h2>Add assets</h2></div>
          <button className="icon-button" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <label className="search-box modal-search">
          <Icon name="search" size={17}/>
          <input autoFocus placeholder="Find a company or ticker" value={search} onChange={e => setSearch(e.target.value)}/>
        </label>
        <div className="asset-picker">
          {filtered.map(s => (
            <div className="asset-option" key={s.symbol}>
              <span className="ticker-icon" style={{'--stock-color': s.color}}>{s.mark}</span>
              <span><b>{s.symbol}</b><small>{s.name}</small></span>
              <button className={`add-asset ${watchlist.includes(s.symbol) ? 'added' : ''}`} onClick={() => toggleWatch(s.symbol)}>
                {watchlist.includes(s.symbol) ? 'Added ✓' : '+ Add'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AuthModal({ authMode, setAuthMode, onSubmit, onClose, authMessage }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="trade-modal auth-modal" onClick={e => e.stopPropagation()} onSubmit={onSubmit}>
        <div className="modal-heading">
          <div>
            <span className="panel-label">NORTHSTAR MARKETS</span>
            <h2>{authMode === 'Login' ? 'Welcome back' : 'Create your account'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <p className="auth-intro">
          {authMode === 'Login' ? 'Log in to access your portfolio and watchlist.' : 'Get started with a free demo account.'}
        </p>
        {authMode === 'Sign up' && (
          <label className="field-label">Full name<input type="text" autoComplete="name" minLength="2" required placeholder="Jordan Davis"/></label>
        )}
        <label className="field-label">Email address<input type="email" autoComplete="email" required placeholder="you@example.com"/></label>
        <label className="field-label auth-password">
          Password<input type="password" autoComplete={authMode === 'Login' ? 'current-password' : 'new-password'} minLength="8" required placeholder="At least 8 characters"/>
        </label>
        <button className="submit-order auth-submit" type="submit">
          {authMode === 'Login' ? 'Log in' : 'Create account'}
        </button>
        {authMessage && <p className="auth-success">{authMessage}</p>}
        <p className="auth-switch">
          {authMode === 'Login' ? 'New to Veltrix?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => setAuthMode(authMode === 'Login' ? 'Sign up' : 'Login')}>
            {authMode === 'Login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
        <p className="demo-notice">Demo only · No account data is sent or stored</p>
      </form>
    </div>
  )
}

function NotifModal({ onClose }) {
  const items = [
    { icon: '📈', title: 'NVDA up 3.42%',       sub: 'Nvidia hits new session high',    time: '2 min ago' },
    { icon: '⚠️', title: 'TSLA down 2.16%',     sub: 'Tesla drops below 50-day MA',     time: '14 min ago' },
    { icon: '💰', title: 'Dividend received',    sub: 'MSFT paid $0.75/share',           time: '1 hr ago' },
    { icon: '🔔', title: 'Price alert: AMZN',   sub: 'AMZN crossed $220 target',         time: '3 hr ago' },
  ]
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="trade-modal notif-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div><span className="panel-label">NOTIFICATIONS</span><h2>Recent alerts</h2></div>
          <button className="icon-button" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <div className="notif-list">
          {items.map((n, i) => (
            <div className="notif-row" key={i}>
              <span className="notif-icon">{n.icon}</span>
              <span className="notif-text"><b>{n.title}</b><small>{n.sub}</small></span>
              <span className="notif-time">{n.time}</span>
            </div>
          ))}
        </div>
        <button className="view-markets" style={{marginTop:8}} onClick={onClose}>Mark all as read</button>
      </div>
    </div>
  )
}

function StockDetailModal({ stock, onBuy, onSell, onClose }) {
  const d = stockDetails[stock.symbol]
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="trade-modal stock-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span className="ticker-icon large" style={{'--stock-color': stock.color}}>{stock.mark}</span>
            <div>
              <span className="panel-label">{d.exchange}</span>
              <h2 style={{margin:'4px 0 0'}}>{stock.symbol}</h2>
            </div>
          </div>
          <button className="icon-button" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <p style={{color:'#8793a0', fontSize:11, margin:'4px 0 16px'}}>{stock.name}</p>
        <div className="order-summary" style={{marginTop:0}}>
          <span>Price</span><b>${d.price.toFixed(2)}</b>
          <span>Change</span><b style={{color: d.change < 0 ? '#ed777d':'#54d3a0'}}>{d.diff} ({d.change>0?'+':''}{d.change}%)</b>
          <span>Volume</span><b>{d.volume}</b>
          <span>Day range</span><b>{d.range}</b>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:8}}>
          <button className="submit-order" onClick={() => onBuy(stock)}>Buy {stock.symbol}</button>
          <button className="submit-order sell-button" onClick={() => onSell(stock)}>Sell {stock.symbol}</button>
        </div>
        <p className="demo-notice">Demo mode · No real transaction will be made</p>
      </div>
    </div>
  )
}

function ProfileModal({ isLoggedIn, onClose, onLogout }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="trade-modal profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <span className="avatar" style={{width:38, height:38, fontSize:13}}>JD</span>
            <div>
              <span className="panel-label">INDIVIDUAL ACCOUNT</span>
              <h2 style={{margin:'4px 0 0', fontSize:18}}>Jordan Davis</h2>
            </div>
          </div>
          <button className="icon-button" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <div className="order-summary" style={{marginTop:16}}>
          <span>Email</span><b>jordan@example.com</b>
          <span>Account type</span><b>Individual</b>
          <span>Status</span><b style={{color:'#54d3a0'}}>● {isLoggedIn ? 'Logged in' : 'Guest'}</b>
          <span>Member since</span><b>Jan 2024</b>
        </div>
        <button className="outline-button" style={{width:'100%', justifyContent:'center', marginTop:12, padding:10}}
          onClick={() => { alert('Settings – coming soon (demo)') }}>Account Settings</button>
        <button className="submit-order sell-button" style={{marginTop:8}} onClick={onLogout}>Log out</button>
        <p className="demo-notice">Demo only · No real account data stored</p>
      </div>
    </div>
  )
}

/* ─── PAGES ─── */

function OverviewPage({ onTrade, onDetail, onOpenWatch, period, setPeriod, portfolioPeriod, cyclePeriod, showToast }) {
  const moversOrder = [stocks[0], stocks[4], stocks[1], stocks[3], stocks[5], stocks[2]]
  const holdingsOrder = [stocks[0], stocks[1], stocks[3], stocks[4]]
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata',
  }).format(new Date()).toUpperCase()

  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="live-dot"/> {todayLabel} <span className="eyebrow-divider">/</span> MARKET OPEN</div>
          <h1>Good afternoon, Jordan <span className="wave">✳</span></h1>
          <p className="welcome-subtitle">Here's what's happening with your portfolio today.</p>
        </div>
        <button className="outline-button" onClick={onOpenWatch}><Icon name="plus" size={16}/> Add to watchlist</button>
      </section>

      <section className="market-strip" aria-label="Market overview">
        <div className="market-strip-title"><span className="live-dot"/> MARKET OVERVIEW</div>
        {[['S&P 500','5,842.47','+0.82%'],['NASDAQ','18,678.41','+1.24%'],['DOW JONES','43,958.19','+0.35%'],['RUSSELL 2000','2,316.58','−0.18%']].map(([name,val,chg]) => (
          <button key={name} className="market-index market-index-btn" onClick={() => showToast(`${name}: ${val} (${chg}) — demo data`)}>
            <span>{name}</span><b>{val}</b><small className={chg.startsWith('−')?'negative':''}>{chg}</small>
          </button>
        ))}
      </section>

      <section className="summary-grid">
        <article className="panel balance-card">
          <div className="panel-heading">
            <span className="panel-label">TOTAL PORTFOLIO VALUE <span className="info-dot" style={{cursor:'pointer'}} onClick={()=>showToast('Total market value of all your holdings')}>i</span></span>
            <button className="quiet-button" onClick={cyclePeriod}>{portfolioPeriod} <Icon name="down" size={14}/></button>
          </div>
          <div className="balance-amount">$24,680<span>.50</span></div>
          <div className="balance-change"><span className="change-pill">↗ 4.28%</span><span>+$1,012.40</span><span className="muted">past month</span></div>
          <div className="balance-chart">
            <svg viewBox="0 0 600 84" preserveAspectRatio="none">
              <defs><linearGradient id="balanceFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4adea8" stopOpacity=".22"/><stop offset="100%" stopColor="#4adea8" stopOpacity="0"/></linearGradient></defs>
              <path d="M0 70 C28 66 35 49 58 56 S91 53 110 61 140 49 163 51 194 39 218 45 251 29 275 37 307 24 331 33 361 27 386 34 412 13 438 26 469 21 492 27 522 12 543 19 573 10 600 3 L600 84 L0 84Z" fill="url(#balanceFill)"/>
              <path d="M0 70 C28 66 35 49 58 56 S91 53 110 61 140 49 163 51 194 39 218 45 251 29 275 37 307 24 331 33 361 27 386 34 412 13 438 26 469 21 492 27 522 12 543 19 573 10 600 3" fill="none" stroke="#47d8a3" strokeWidth="2.3" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>
          <div className="chart-dates"><span>OCT 13</span><span>OCT 20</span><span>OCT 27</span><span>NOV 03</span><span>NOV 12</span></div>
        </article>

        <article className="panel allocation-card">
          <div className="panel-heading">
            <span className="panel-label">ASSET ALLOCATION</span>
            <button className="icon-button small" onClick={()=>showToast('Equities $19,250 · ETFs $3,948 · Cash $1,482')}><Icon name="more" size={17}/></button>
          </div>
          <div className="allocation-body">
            <div className="donut" style={{cursor:'pointer'}} onClick={()=>showToast('6 assets across 3 categories')}>
              <div className="donut-hole"><b>6</b><span>assets</span></div>
            </div>
            <div className="allocation-legend">
              {[['equity','Equities','78%'],['etf','ETFs','16%'],['cash','Cash','6%']].map(([cls,lbl,pct])=>(
                <div key={cls} style={{cursor:'pointer'}} onClick={()=>showToast(`${lbl}: ${pct}`)}>
                  <i className={`legend-dot ${cls}`}/><span>{lbl}</span><b>{pct}</b>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel chart-card">
          <div className="stock-chart-header">
            <div className="stock-title">
              <span className="ticker-icon large" style={{'--stock-color': stocks[0].color, cursor:'pointer'}} onClick={()=>onDetail(stocks[0])}>N</span>
              <div>
                <div className="stock-name-line"><h2>NVIDIA</h2><span className="exchange-tag">NASDAQ</span></div>
                <span className="company-name">NVIDIA Corporation <span className="live-dot tiny"/> Live market</span>
              </div>
            </div>
            <div className="stock-chart-price" style={{cursor:'pointer'}} onClick={()=>onTrade('Buy',stocks[0])}>
              <b>$142.87</b><span>+$4.72 (3.42%)</span>
            </div>
          </div>
          <div className="chart-toolbar">
            <span className="chart-caption">NVDA <span>·</span> Price performance</span>
            <div className="period-tabs">
              {['1D','1W','1M','1Y'].map(p=>(
                <button key={p} className={period===p?'active':''} onClick={()=>setPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="chart-plot">
            <div className="chart-y-labels"><span>$145</span><span>$140</span><span>$135</span><span>$130</span></div>
            <svg className="price-chart" viewBox="0 0 600 128" preserveAspectRatio="none">
              <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#42d6a0" stopOpacity=".18"/><stop offset="100%" stopColor="#42d6a0" stopOpacity="0"/></linearGradient></defs>
              {[20,49,78,107].map(y=><line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#212a36" strokeDasharray="3 5"/>)}
              <polygon points={`0,128 ${chartPoints[period]} 600,128`} fill="url(#chartFill)"/>
              <polyline points={chartPoints[period]} fill="none" stroke="#4bd8a5" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
              <circle cx="600" cy={chartPoints[period].split(' ').at(-1).split(',')[1]} r="4" fill="#4bd8a5" stroke="#0e151e" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
            </svg>
            <div className="chart-x-labels"><span>9:30 AM</span><span>10:30 AM</span><span>11:30 AM</span><span>12:30 PM</span><span>1:30 PM</span><span>2:30 PM</span></div>
          </div>
          <div className="chart-foot">
            <span><i className="legend-dot equity"/> NVDA</span>
            <span>Volume <b>32.4M</b></span>
            <span>Day range <b>$138.11 – $143.22</b></span>
          </div>
        </article>

        <article className="panel movers-card">
          <div className="panel-heading">
            <div><h2 className="section-title">Top movers</h2><span className="section-subtitle">Biggest moves today</span></div>
            <button className="text-link" onClick={()=>showToast('View all — open Markets for full list')}>View all <Icon name="arrow" size={14}/></button>
          </div>
          <div className="mover-heading"><span>ASSET</span><span>PRICE</span><span>CHANGE</span></div>
          <div className="mover-list">
            {moversOrder.map(s=>(
              <button key={s.symbol} className="mover-row mover-row-btn" onClick={()=>onDetail(s)}>
                <span className="mover-asset">
                  <span className="ticker-icon" style={{'--stock-color':s.color}}>{s.mark}</span>
                  <span><b>{s.symbol}</b><small>{s.name.split(' ')[0]}</small></span>
                </span>
                <b className="mover-price">${s.price.toFixed(2)}</b>
                <div className={`mover-change ${s.change<0?'negative':''}`}><MiniChart down={s.change<0}/><span>{s.change>0?'+':''}{s.change}%</span></div>
              </button>
            ))}
          </div>
          <button className="view-markets" onClick={()=>showToast('Open Markets tab for full market data')}>Explore all markets <Icon name="arrow" size={14}/></button>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel holdings-card">
          <div className="panel-heading">
            <div><h2 className="section-title">Your holdings</h2><span className="section-subtitle">A snapshot of your investments</span></div>
            <button className="text-link" onClick={()=>showToast('Open Portfolio tab for full details')}>Full portfolio <Icon name="arrow" size={14}/></button>
          </div>
          <div className="holdings-table">
            <div className="table-head"><span>ASSET</span><span>SHARES</span><span>PRICE</span><span>MARKET VALUE</span><span>24H</span><span/></div>
            {holdingsOrder.map((s,i)=>(
              <button key={s.symbol} className="holding-row holding-row-btn" onClick={()=>onDetail(s)}>
                <span className="holding-asset">
                  <span className="ticker-icon" style={{'--stock-color':s.color}}>{s.mark}</span>
                  <span><b>{s.symbol}</b><small>{s.name}</small></span>
                </span>
                <span>{holdingShares[s.symbol]} shares</span>
                <span>${s.price.toFixed(2)}</span>
                <b>${holdingValues[s.symbol].toLocaleString('en-US',{minimumFractionDigits:2})}</b>
                <span className={s.change<0?'negative':'positive'}>{s.change>0?'+':''}{s.change}%</span>
                <span className="icon-button small row-more" onClick={e=>{e.stopPropagation();onTrade('Buy',s)}}><Icon name="more" size={16}/></span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel watch-card">
          <div className="panel-heading">
            <div><h2 className="section-title">Watchlist</h2><span className="section-subtitle">Your saved assets</span></div>
            <button className="icon-button small" onClick={onOpenWatch}><Icon name="plus" size={16}/></button>
          </div>
          <div className="watch-items">
            {stocks.slice(0,4).map(s=>(
              <div key={s.symbol} className="watch-row">
                <span className="ticker-icon" style={{'--stock-color':s.color,cursor:'pointer'}} onClick={()=>onDetail(s)}>{s.mark}</span>
                <span className="watch-symbol" style={{cursor:'pointer'}} onClick={()=>onDetail(s)}><b>{s.symbol}</b><small>{s.name.split(' ')[0]}</small></span>
                <span className="watch-price"><b>${s.price.toFixed(2)}</b><small className={s.change<0?'negative':''}>{s.change>0?'+':''}{s.change}%</small></span>
                <button className="watch-action" onClick={()=>onTrade('Buy',s)}><Icon name="arrow" size={15}/></button>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="footer-note">
        <span>© 2026 Veltrix Markets</span>
        <span><i className="live-dot"/> All systems operational</span>
        <span>Market data is delayed · Demo environment</span>
      </footer>
    </>
  )
}

function MarketsPage({ onTrade, onDetail, showToast }) {
  const [filter, setFilter] = useState('All')
  const sectors = ['All', 'Technology', 'Automotive', 'Consumer']
  const list = filter === 'All' ? stocks : stocks.filter(s => s.sector === filter)

  return (
    <>
      <section className="page-header-row">
        <div>
          <div className="eyebrow"><span className="live-dot"/> MARKETS <span className="eyebrow-divider">/</span> LIVE</div>
          <h1 className="page-h1">Markets <span style={{color:'#52d9a4'}}>Overview</span></h1>
          <p className="welcome-subtitle">Real-time prices and performance across all tracked assets.</p>
        </div>
        <div style={{display:'flex', gap:6}}>
          {sectors.map(s=>(
            <button key={s} className={`filter-pill ${filter===s?'active':''}`} onClick={()=>setFilter(s)}>{s}</button>
          ))}
        </div>
      </section>

      <section className="market-strip" style={{marginBottom:20}} aria-label="Market overview">
        <div className="market-strip-title"><span className="live-dot"/> INDICES</div>
        {[['S&P 500','5,842.47','+0.82%'],['NASDAQ','18,678.41','+1.24%'],['DOW JONES','43,958.19','+0.35%'],['VIX','14.32','-1.90%']].map(([name,val,chg])=>(
          <button key={name} className="market-index market-index-btn" onClick={()=>showToast(`${name}: ${val} (${chg})`)}>
            <span>{name}</span><b>{val}</b><small className={chg.startsWith('-')&&chg!=='+0.00%'?'negative':''}>{chg}</small>
          </button>
        ))}
      </section>

      <div className="panel" style={{padding:'0 0 8px'}}>
        <div className="markets-table-head">
          <span>ASSET</span><span>SECTOR</span><span>PRICE</span><span>24H CHANGE</span><span>MARKET CAP</span><span>P/E</span><span>TREND</span><span></span>
        </div>
        {list.map(s=>(
          <div key={s.symbol} className="markets-row" role="button" tabIndex={0} onClick={()=>onDetail(s)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onDetail(s)}}}>
            <span className="mover-asset">
              <span className="ticker-icon" style={{'--stock-color':s.color}}>{s.mark}</span>
              <span><b>{s.symbol}</b><small>{s.name}</small></span>
            </span>
            <span className="sector-tag">{s.sector}</span>
            <b style={{color:'#dce3e9', fontSize:11}}>${s.price.toFixed(2)}</b>
            <span className={`change-badge ${s.change<0?'negative':''}`}>{s.change>0?'+':''}{s.change}%</span>
            <span style={{color:'#9aaab7', fontSize:10}}>{s.mktCap}</span>
            <span style={{color:'#9aaab7', fontSize:10}}>{s.pe}x</span>
            <MiniChart down={s.change<0}/>
            <span style={{display:'flex', gap:5}}>
              <button className="trade-mini-btn buy" onClick={e=>{e.stopPropagation();onTrade('Buy',s)}}>Buy</button>
              <button className="trade-mini-btn sell" onClick={e=>{e.stopPropagation();onTrade('Sell',s)}}>Sell</button>
            </span>
          </div>
        ))}
      </div>

      <div className="markets-bottom-grid">
        <article className="panel" style={{padding:18}}>
          <div className="panel-heading" style={{marginBottom:14}}>
            <span className="panel-label">SECTOR PERFORMANCE</span>
          </div>
          {[['Technology','+1.84%','#4bd5a1'],['Consumer','+2.71%','#4bd5a1'],['Automotive','-2.16%','#ed777d'],['Financials','+0.38%','#4bd5a1'],['Energy','-0.72%','#ed777d']].map(([sec,chg,col])=>(
            <div key={sec} className="sector-row">
              <span style={{fontSize:10,color:'#b0bac5'}}>{sec}</span>
              <div className="sector-bar-wrap">
                <div className="sector-bar" style={{width:`${Math.abs(parseFloat(chg))*25}%`, background:col}}/>
              </div>
              <span style={{fontSize:10,color:col,minWidth:46,textAlign:'right'}}>{chg}</span>
            </div>
          ))}
        </article>

        <article className="panel" style={{padding:18}}>
          <div className="panel-heading" style={{marginBottom:14}}>
            <span className="panel-label">MARKET SENTIMENT</span>
          </div>
          {[['Fear & Greed','72 — Greed','#f4a32e'],['Put/Call Ratio','0.84','#4bd5a1'],['VIX','14.32','#4bd5a1'],['Advance/Decline','1.4:1','#4bd5a1']].map(([lbl,val,col])=>(
            <div key={lbl} className="sector-row">
              <span style={{fontSize:10,color:'#b0bac5'}}>{lbl}</span>
              <b style={{fontSize:10,color:col}}>{val}</b>
            </div>
          ))}
        </article>
      </div>
    </>
  )
}

function PortfolioPage({ onTrade, onDetail, showToast }) {
  const holdings = [
    { ...stocks[0], shares: 12, avgCost: 118.33, value: 1714.44, cost: holdingCost.NVDA },
    { ...stocks[1], shares:  8, avgCost: 220.00, value: 1899.92, cost: holdingCost.AAPL },
    { ...stocks[3], shares:  6, avgCost: 390.00, value: 2491.92, cost: holdingCost.MSFT },
    { ...stocks[4], shares: 10, avgCost: 208.00, value: 2241.80, cost: holdingCost.AMZN },
  ]
  const totalValue = holdings.reduce((a,h)=>a+h.value,0)
  const totalCost  = holdings.reduce((a,h)=>a+h.cost,0)
  const totalGain  = totalValue - totalCost
  const totalPct   = ((totalGain/totalCost)*100).toFixed(2)

  return (
    <>
      <section className="page-header-row">
        <div>
          <div className="eyebrow"><span className="live-dot"/> PORTFOLIO <span className="eyebrow-divider">/</span> OVERVIEW</div>
          <h1 className="page-h1">Your <span style={{color:'#52d9a4'}}>Portfolio</span></h1>
          <p className="welcome-subtitle">Track your holdings, performance, and allocation.</p>
        </div>
        <button className="outline-button" onClick={()=>onTrade('Buy',stocks[0])}><Icon name="plus" size={16}/> New order</button>
      </section>

      <div className="portfolio-stats">
        {[
          ['Total Value',   `$${totalValue.toLocaleString('en-US',{minimumFractionDigits:2})}`,       '#e0e7ec'],
          ['Total Cost',    `$${totalCost.toLocaleString('en-US',{minimumFractionDigits:2})}`,        '#9aaab7'],
          ['Total Gain',    `+$${totalGain.toLocaleString('en-US',{minimumFractionDigits:2})}`,       '#54d3a0'],
          ['Return',        `+${totalPct}%`,                                                           '#54d3a0'],
          ['# Holdings',   `${holdings.length}`,                                                       '#e0e7ec'],
          ['Cash',         '$1,482.14',                                                                 '#e0e7ec'],
        ].map(([lbl,val,col])=>(
          <div key={lbl} className="stat-card panel">
            <span className="panel-label">{lbl}</span>
            <b style={{color:col, fontSize:16, fontFamily:'Manrope,sans-serif', letterSpacing:'-0.5px'}}>{val}</b>
          </div>
        ))}
      </div>

      <div className="portfolio-grid">
        <article className="panel" style={{padding:'16px 18px 10px', gridColumn:'1/-1'}}>
          <div className="panel-heading" style={{marginBottom:16}}>
            <div><h2 className="section-title">Holdings</h2><span className="section-subtitle">All positions</span></div>
          </div>
          <div className="holdings-table full-table">
            <div className="table-head full-head">
              <span>ASSET</span><span>SHARES</span><span>AVG COST</span><span>CUR PRICE</span>
              <span>MARKET VALUE</span><span>GAIN/LOSS</span><span>RETURN</span><span>24H</span><span></span>
            </div>
            {holdings.map(h=>{
              const gain = h.value - h.cost
              const ret  = ((gain/h.cost)*100).toFixed(2)
              return (
                <div key={h.symbol} className="holding-row full-holding-row holding-row-btn" role="button" tabIndex={0} onClick={()=>onDetail(h)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onDetail(h)}}}>
                  <span className="holding-asset">
                    <span className="ticker-icon" style={{'--stock-color':h.color}}>{h.mark}</span>
                    <span><b>{h.symbol}</b><small>{h.name}</small></span>
                  </span>
                  <span>{h.shares} shares</span>
                  <span>${h.avgCost.toFixed(2)}</span>
                  <span>${h.price.toFixed(2)}</span>
                  <b>${h.value.toLocaleString('en-US',{minimumFractionDigits:2})}</b>
                  <span className={gain>=0?'positive':'negative'}>{gain>=0?'+':''}{gain.toFixed(2)}</span>
                  <span className={gain>=0?'positive':'negative'}>{gain>=0?'+':''}{ret}%</span>
                  <span className={h.change<0?'negative':'positive'}>{h.change>0?'+':''}{h.change}%</span>
                  <span style={{display:'flex',gap:5}} onClick={e=>e.stopPropagation()}>
                    <button className="trade-mini-btn buy" onClick={()=>onTrade('Buy',h)}>Buy</button>
                    <button className="trade-mini-btn sell" onClick={()=>onTrade('Sell',h)}>Sell</button>
                  </span>
                </div>
              )
            })}
          </div>
        </article>

        <article className="panel" style={{padding:18}}>
          <div className="panel-heading" style={{marginBottom:16}}>
            <span className="panel-label">ALLOCATION BY HOLDING</span>
          </div>
          {holdings.map(h=>{
            const pct = ((h.value/totalValue)*100).toFixed(1)
            return (
              <div key={h.symbol} className="sector-row" style={{cursor:'pointer'}} onClick={()=>onDetail(h)}>
                <span style={{display:'flex',alignItems:'center',gap:7}}>
                  <span className="ticker-icon" style={{'--stock-color':h.color,width:20,height:20,fontSize:10}}>{h.mark}</span>
                  <span style={{fontSize:10,color:'#b0bac5'}}>{h.symbol}</span>
                </span>
                <div className="sector-bar-wrap">
                  <div className="sector-bar" style={{width:`${pct}%`,background:h.color}}/>
                </div>
                <span style={{fontSize:10,color:'#c0cad5',minWidth:36,textAlign:'right'}}>{pct}%</span>
              </div>
            )
          })}
        </article>

        <article className="panel" style={{padding:18}}>
          <div className="panel-heading" style={{marginBottom:16}}>
            <span className="panel-label">PERFORMANCE SUMMARY</span>
          </div>
          {[
            ['Today\'s P&L',  '+$312.80', '#54d3a0'],
            ['Week P&L',      '+$628.14', '#54d3a0'],
            ['Month P&L',    '+$1,012.40','#54d3a0'],
            ['Year P&L',     '+$3,480.28','#54d3a0'],
            ['Dividends YTD','$142.50',   '#c5a96e'],
            ['Realized G/L', '+$890.00',  '#54d3a0'],
          ].map(([lbl,val,col])=>(
            <div key={lbl} className="sector-row">
              <span style={{fontSize:10,color:'#b0bac5'}}>{lbl}</span>
              <b style={{fontSize:10,color:col}}>{val}</b>
            </div>
          ))}
        </article>
      </div>
    </>
  )
}

function ActivityPage({ tradeHistory, onTrade, showToast }) {
  const [tab, setTab] = useState('Orders')
  const tabs = ['Orders', 'Dividends', 'Deposits']

  const dividends = [
    { symbol:'MSFT', name:'Microsoft', amount:'$6.00', date:'Nov 8, 2026', shares:8 },
    { symbol:'AAPL', name:'Apple', amount:'$1.84', date:'Oct 14, 2026', shares:8 },
    { symbol:'MSFT', name:'Microsoft', amount:'$6.00', date:'Aug 8, 2026', shares:8 },
  ]
  const deposits = [
    { type:'Deposit', amount:'+$5,000.00', date:'Oct 1, 2026', method:'Bank Transfer' },
    { type:'Deposit', amount:'+$2,500.00', date:'Sep 1, 2026', method:'Bank Transfer' },
    { type:'Withdrawal', amount:'-$1,000.00', date:'Aug 15, 2026', method:'Bank Transfer' },
  ]

  return (
    <>
      <section className="page-header-row">
        <div>
          <div className="eyebrow"><span className="live-dot"/> ACTIVITY <span className="eyebrow-divider">/</span> HISTORY</div>
          <h1 className="page-h1">Activity <span style={{color:'#52d9a4'}}>Log</span></h1>
          <p className="welcome-subtitle">Your complete order and transaction history.</p>
        </div>
        <button className="outline-button" onClick={()=>onTrade('Buy',stocks[0])}><Icon name="plus" size={16}/> New order</button>
      </section>

      <div className="panel" style={{padding:'16px 18px'}}>
        <div style={{display:'flex', gap:4, marginBottom:18}}>
          {tabs.map(t=>(
            <button key={t} className={`filter-pill ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'Orders' && (
          <>
            {tradeHistory.length === 0 && (
              <div className="activity-empty">
                <Icon name="clock" size={32}/>
                <p style={{marginTop:12, fontSize:11}}>No orders placed yet in this session.<br/>Use Buy/Sell buttons to place demo orders.</p>
                <button className="submit-order" style={{width:'auto', padding:'0 24px', marginTop:16}} onClick={()=>onTrade('Buy',stocks[0])}>Place first order</button>
              </div>
            )}
            {tradeHistory.map((t,i)=>(
              <div key={i} className="activity-row">
                <span className={`activity-badge ${t.side==='Buy'?'buy':'sell'}`}>{t.side}</span>
                <span className="activity-asset">
                  <b>{t.qty} × {t.symbol}</b>
                  <small>@ ${t.price.toFixed(2)} per share</small>
                </span>
                <b style={{color:'#dce3e9', fontSize:11}}>${(t.qty*t.price).toLocaleString('en-US',{minimumFractionDigits:2})}</b>
                <span style={{color:'#8793a0', fontSize:9}}>{t.time}</span>
                <span className={`status-pill ${t.side==='Buy'?'filled-buy':'filled-sell'}`}>Filled</span>
              </div>
            ))}
          </>
        )}

        {tab === 'Dividends' && dividends.map((d,i)=>(
          <div key={i} className="activity-row">
            <span className="activity-badge" style={{background:'#1a2e1a',color:'#c5a96e'}}>DIV</span>
            <span className="activity-asset">
              <b>{d.symbol} Dividend</b>
              <small>{d.name} · {d.shares} shares</small>
            </span>
            <b style={{color:'#c5a96e', fontSize:11}}>{d.amount}</b>
            <span style={{color:'#8793a0', fontSize:9}}>{d.date}</span>
            <span className="status-pill" style={{background:'#1c2d1a',color:'#7dcf8e'}}>Paid</span>
          </div>
        ))}

        {tab === 'Deposits' && deposits.map((d,i)=>(
          <div key={i} className="activity-row">
            <span className="activity-badge" style={{background:d.type==='Withdrawal'?'#2a1215':'#141e28',color:d.type==='Withdrawal'?'#f36c73':'#6591e7'}}>
              {d.type==='Withdrawal'?'OUT':'IN'}
            </span>
            <span className="activity-asset">
              <b>{d.type}</b>
              <small>{d.method}</small>
            </span>
            <b style={{color: d.type==='Withdrawal'?'#ed777d':'#54d3a0', fontSize:11}}>{d.amount}</b>
            <span style={{color:'#8793a0', fontSize:9}}>{d.date}</span>
            <span className="status-pill" style={{background:'#1c2d1a',color:'#7dcf8e'}}>Completed</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── MAIN APP ─── */
export default function App() {
  const [activeNav,       setActiveNav]       = useState('Overview')
  const [period,          setPeriod]           = useState('1D')
  const [search,          setSearch]           = useState('')
  const [watchlist,       setWatchlist]        = useState(['NVDA','AAPL','TSLA','MSFT'])
  const [modal,           setModal]            = useState('')
  const [authMode,        setAuthMode]         = useState('Login')
  const [authMessage,     setAuthMessage]      = useState('')
  const [tradeSide,       setTradeSide]        = useState('Buy')
  const [tradeStock,      setTradeStock]       = useState(stocks[0])
  const [detailStock,     setDetailStock]      = useState(null)
  const [quantity,        setQuantity]         = useState('10')
  const [toast,           setToast]            = useState('')
  const [portfolioPeriod, setPortfolioPeriod]  = useState('Today')
  const [tradeHistory,    setTradeHistory]     = useState([])
  const [isLoggedIn,      setIsLoggedIn]       = useState(false)

  const filtered = useMemo(
    ()=> stocks.filter(s=>`${s.symbol} ${s.name}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const showToast = msg => { setToast(msg); window.setTimeout(()=>setToast(''), 3200) }

  const openTrade = (side, stock) => { setTradeSide(side); setTradeStock(stock); setModal('trade') }
  const openDetail = stock => { setDetailStock(stock); setModal('stock') }
  const toggleWatch = sym => setWatchlist(items => items.includes(sym) ? items.filter(i=>i!==sym) : [...items,sym])

  const cyclePeriod = () => {
    const cycle = { 'Today':'1W','1W':'1M','1M':'3M','3M':'1Y','1Y':'Today' }
    setPortfolioPeriod(p => cycle[p]||'Today')
  }

  const submitTrade = e => {
    e.preventDefault()
    const time = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
    setTradeHistory(h=>[{side:tradeSide,symbol:tradeStock.symbol,qty:Number(quantity),price:tradeStock.price,time},...h])
    setModal('')
    showToast(`${tradeSide} order placed · ${quantity} ${tradeStock.symbol} shares`)
  }

  const handleAuthSubmit = e => {
    e.preventDefault()
    setAuthMessage(`${authMode} successful!`)
    setIsLoggedIn(true)
    window.setTimeout(()=>{ setModal(''); setAuthMessage('') }, 1200)
  }

  const handleLogout = () => { setIsLoggedIn(false); setModal(''); showToast('Logged out successfully') }

  const pageProps = { onTrade: openTrade, onDetail: openDetail, showToast }

  return (
    <div className="app-shell">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M5 7h6.2l4.8 12.1L20.8 7H27L17.5 27h-3L5 7Z" fill="currentColor"/><path d="M18 22.8 22.1 14H28l-5.3 11.1" stroke="#0c1117" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          <span>veltrix<span className="brand-dot">.</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {[['Overview','grid'],['Markets','chart'],['Portfolio','briefcase'],['Activity','clock']].map(([label,icon])=>(
            <button
              key={label}
              className={`nav-item ${activeNav===label?'selected':''}`}
              onClick={()=>setActiveNav(label)}
            >
              <Icon name={icon}/>
              <span>{label}</span>
              {label==='Activity' && (
                <span className="nav-count">{tradeHistory.length > 0 ? tradeHistory.length : 3}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="side-watch-head">
          <span className="workspace-label">WATCHLIST</span>
          <button className="icon-button small" onClick={()=>setModal('watch')} aria-label="Add"><Icon name="plus" size={16}/></button>
        </div>
        <div className="side-watch-list">
          {stocks.filter(s=>watchlist.includes(s.symbol)).map(s=>(
            <button key={s.symbol} className="side-stock" onClick={()=>openDetail(s)}>
              <span className="ticker-icon" style={{'--stock-color':s.color}}>{s.mark}</span>
              <span className="side-stock-name"><b>{s.symbol}</b><small>{s.name.split(' ')[0]}</small></span>
              <span className={`side-stock-change ${s.change<0?'negative':''}`}>{s.change>0?'+':''}{s.change}%</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="market-status"><span className="live-dot"/><span>Markets open</span><span className="market-time">· 2:41 PM ET</span></div>
          <button className="profile-card" onClick={()=>setModal('profile')}>
            <span className="avatar">JD</span>
            <span className="profile-text"><b>Jordan Davis</b><small>{isLoggedIn?'Logged in':'Individual account'}</small></span>
            <Icon name="more" size={17}/>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-content" id="top">
        <header className="topbar">
          <div className="breadcrumbs">
            <span style={{cursor:'pointer'}} onClick={()=>setActiveNav('Overview')}>Workspace</span>
            <Icon name="chevron" size={14}/>
            <b>{activeNav}</b>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Icon name="search" size={17}/>
              <input aria-label="Search stocks" placeholder="Search stocks..." value={search}
                onChange={e=>setSearch(e.target.value)}
                onFocus={()=>{ if(!search) setModal('watch') }}/>
              <kbd>⌘ K</kbd>
            </label>
            {isLoggedIn
              ? <button className="auth-signup" onClick={()=>setModal('profile')}>My Account</button>
              : <>
                  <button className="auth-link" onClick={()=>{ setAuthMode('Login'); setModal('auth') }}>Log in</button>
                  <button className="auth-signup" onClick={()=>{ setAuthMode('Sign up'); setModal('auth') }}>Sign up</button>
                </>
            }
            <button className="icon-button notification-button" aria-label="Notifications" onClick={()=>setModal('notif')}>
              <Icon name="bell"/><i/>
            </button>
            <button className="avatar top-avatar"
              onClick={()=> isLoggedIn ? setModal('profile') : (setAuthMode('Login'), setModal('auth'))}>JD</button>
          </div>
        </header>

        <div className="page-wrap">
          {activeNav === 'Overview'  && <OverviewPage  {...pageProps} period={period} setPeriod={setPeriod} portfolioPeriod={portfolioPeriod} cyclePeriod={cyclePeriod} onOpenWatch={()=>setModal('watch')}/>}
          {activeNav === 'Markets'   && <MarketsPage   {...pageProps}/>}
          {activeNav === 'Portfolio' && <PortfolioPage {...pageProps}/>}
          {activeNav === 'Activity'  && <ActivityPage  {...pageProps} tradeHistory={tradeHistory}/>}
        </div>
      </main>

      {/* ── MODALS ── */}
      {modal==='trade' && (
        <TradeModal stock={tradeStock} side={tradeSide} setSide={setTradeSide}
          quantity={quantity} setQuantity={setQuantity} onSubmit={submitTrade} onClose={()=>setModal('')}/>
      )}
      {modal==='watch' && (
        <WatchModal filtered={filtered} watchlist={watchlist} search={search}
          setSearch={setSearch} toggleWatch={toggleWatch} onClose={()=>setModal('')}/>
      )}
      {modal==='auth' && (
        <AuthModal authMode={authMode} setAuthMode={setAuthMode}
          onSubmit={handleAuthSubmit} onClose={()=>setModal('')} authMessage={authMessage}/>
      )}
      {modal==='notif'   && <NotifModal onClose={()=>setModal('')}/>}
      {modal==='stock'   && detailStock && (
        <StockDetailModal stock={detailStock}
          onBuy={s=>{setModal('');openTrade('Buy',s)}}
          onSell={s=>{setModal('');openTrade('Sell',s)}}
          onClose={()=>setModal('')}/>
      )}
      {modal==='profile' && <ProfileModal isLoggedIn={isLoggedIn} onClose={()=>setModal('')} onLogout={handleLogout}/>}

      {toast && <div className="toast-message"><span className="live-dot"/>{toast}</div>}
    </div>
  )
}

