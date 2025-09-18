import { useState } from 'react';

type ExpandableTextProps = {
  htmlText: string;
  maxLength?: number;
};

const ExpandableText = ({ htmlText, maxLength = 300 }: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // HTML etiketlerini temizleyerek metnin gerçek uzunluğunu bulalım
  const plainText = htmlText.replace(/<[^>]*>?/gm, '');

  if (plainText.length <= maxLength) {
    return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
  }

  // Metni kısaltırken HTML linklerinin bozulmamasına dikkat etmek zordur,
  // bu yüzden basit bir metin kesme yapacağız.
  const truncatedText = plainText.substring(0, maxLength) + '...';

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: isExpanded ? htmlText : truncatedText,
        }}
      />
      <button onClick={() => setIsExpanded(!isExpanded)} className="expand-button">
        {isExpanded ? 'Daha Az Göster' : 'Daha Fazla Oku'}
      </button>
    </div>
  );
};

export default ExpandableText;