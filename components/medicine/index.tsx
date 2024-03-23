
import React, { useEffect, useState } from 'react';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { getEachSalesData } from '../../services/sale';

interface Card {
  index: number;
  quantity: string;
  unit_price: string;
  total_inc_vat: string;
  total: string;
  name: string;
  item_code: string;
  description: string;
  id_number: string
  id: number;
  title: string;
  content: string;
}
interface tableprops{
  Id:string
}
const CardList: React.FC<any>  = ({Id}:tableprops) => {
  const [medicines, setMedicine] = useState<Card[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [noMedicine, setNoMedicine] = useState(false);
  
  const handleCardToggle = (cardId: number) => {
    setExpandedCardId(cardId === expandedCardId ? null : cardId);
    console.log(cardId)
  };
  useEffect(() => {
    const fetchCustomers = async () => {
      console.log('medicine')
      try {
        const response = await getEachSalesData(Id);
            console.log('medicine')
        setMedicine(response.data.sales);
        console.log("Medicine", response.data.sales);
      } catch (error) {
        console.error("Unable to fetch medicines:", error);
        setNoMedicine(true)
      }
    };

    fetchCustomers();
  }, []);


  return (
    <div className="grid grid-cols-3 gap-4">

{noMedicine ? (
        <h1>No Medicine Purchased </h1>
      ) : (
        <div>
      {Array.isArray(medicines) && medicines.map((medicine, index) => (
        <div key={medicine.index} className="bg-white shadow-md p-4 hover:bg-blue-500 hover:text-white">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => handleCardToggle(index)}
          ><div>
            <h2 className="text-xl font-bold">{medicine.description}</h2>
             <p className={expandedCardId === index? 'hidden': 'block'}>{medicine.item_code}</p>
             </div>
            {expandedCardId === index ? (
              <HiOutlineChevronUp />
            ) : (
              <HiOutlineChevronDown />
            )}
          </div>
          {expandedCardId === index && (
            <div className="mt-4">
              <p><span className='text-gray-500'>Branch: </span>{medicine.name}</p>
              <p><span className='text-gray-500'>Item code: </span>{medicine.item_code}</p>
              <p><span className='text-gray-500'>Description: </span>{medicine.description}</p>
              <p><span className='text-gray-500'>Quantity: </span>{medicine.quantity}</p>
              <p><span className='text-gray-500'>Unit Price: </span>{medicine.unit_price}</p>
              <p><span className='text-gray-500'>Total Price: </span>{medicine.total}</p>
              <p><span className='text-gray-500'>With Vat: </span>{medicine.total_inc_vat}</p>
            </div>
          )}
        </div>
      ))}
      </div>)}
    </div>
  );
};

export default CardList;