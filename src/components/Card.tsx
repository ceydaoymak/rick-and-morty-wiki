interface CardProps {
  image?: string;
  title?: string;
  description?: string;
}

function Card({ image, title, description }: CardProps) {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm`}>
      {image && (
        <div className="w-full">
          <img src={image} alt={title ?? 'card-image'} className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="p-4">
        {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}

        {description && <div className="mt-2 text-sm text-gray-700">{description}</div>}
      </div>
    </div>
  );
}

export default Card;
