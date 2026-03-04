interface VipItem {
  name: string;
  description: string;
}

interface VipSectionProps {
  items: VipItem[];
}

export default function VipSection({ items }: VipSectionProps) {
  return (
    <div className="page-container">
      <div className="support__header">
        <span className="support__label">Support</span>
        <h2 className="support__heading">VIP Treatment</h2>
      </div>
      <div className="support__grid">
        {items.map((item) => (
          <div key={item.name} className="support__item">
            <div className="col-60 is--vertical-middle">
              <h3 className="support__item-title">{item.name}</h3>
              <p className="support__item-text">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
