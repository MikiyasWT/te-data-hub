import React, { useEffect, useLayoutEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js';
import { getSalesData } from "../../services/sale";
Chart.register(CategoryScale);

const SalesLine = () => {
  const [visualizerData, setVisualizerData] = useState<any>({
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSalesData(selectedPeriod);
       console.log(data,'data')
        const updatedVisualizerData = {
          labels: data.map((sale: any) => sale.date),
          datasets: [
            {
              
              data: data.map((sale: any) => parseFloat(sale.sum)),
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
           
          ],
          
        };

        setVisualizerData(updatedVisualizerData);
        console.log(parseFloat(visualizerData),"price data")
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Sales",
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Items",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Price",
          
        },
        
      },
      
    },
  };
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    // Simulate loading delay (remove this in a real application)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2000 milliseconds (2 seconds) loading delay
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array ensures this effect runs once after initial render


  return (
    <div>
      <select value={selectedPeriod} onChange={handlePeriodChange}>
        <option value="year">Yearly</option>
        <option value="quarter">Quarterly</option>
        <option value="month">Monthly</option>
        <option value="week">Weekly</option>
        <option value="day">Daily</option>
      </select>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        </div>
      ) : (
      <Line data={visualizerData} options={chartOptions} />
      )}
    </div>
  );
};

export default SalesLine;