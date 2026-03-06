import Link from "next/link";

interface ServiceItemProps {
  name: string;
  description: string;
  image: string;
  slug: string;
  icon: string;
  galleryHref: string;
  reverse?: boolean;
}

export default function ServiceItem({
  name,
  description,
  image,
  slug,
  icon,
  galleryHref,
  reverse = false,
}: ServiceItemProps) {
  return (
    <div
      id={slug}
      className={`service-listing ${reverse ? "is--reverse" : ""}`}
      data-wf-class="service-listing"
    >
      <div className="service-listing__img-wrap">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="service-listing__img"
            data-wf-class="service-listing__img"
          />
        )}
      </div>
      <div className="service-listing__content">
        <div className="service-listing__title-wrap">
          <h3 className="service-listing__title">{name}</h3>
          {icon && (
            <img
              src={icon}
              alt=""
              width={30}
              height={30}
              className="service-listing__icon"
            />
          )}
        </div>
        <p className="service-listing__text">{description}</p>
        {galleryHref && (
          <Link
            href={galleryHref}
            className="button is--with-icon"
            data-wf-class="button is--with-icon w-inline-block"
          >
            <span>{name} Gallery</span>
            <span className="button__line" />
            <span className="button__circle" />
          </Link>
        )}
      </div>
    </div>
  );
}
