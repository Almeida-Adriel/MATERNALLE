import React from 'react'


const PlanCard = ({ title, titleKey, features, price }) => {
    
    const handleClick = (e) => {
        e.preventDefault(); 
        
        if (titleKey) {
            sessionStorage.removeItem("plano");
            sessionStorage.setItem("plano", titleKey);
        } else {
            console.error("titleKey é undefined. O Plano não foi salvo.");
        }

        window.location.href = "/cadastro";
    }
    
    return (
        <div className={`
            p-6 rounded-xl shadow-lg transition-all duration-300 transform 
            bg-white border border-brand-100 hover:shadow-2xl hover:scale-105 
            hover:bg-brand-500 hover:text-white group
        `}>
            <h4 className="text-xl font-bold text-brand-800 group-hover:text-white">
                {title}
            </h4>
            
            <p className="mt-2 text-slate-600 group-hover:text-brand-100">
                <span className="text-3xl font-extrabold">{price}</span>
                {price !== 'Grátis' && ' / mês'}
            </p>
            
            <ul className="mt-4 space-y-2 text-sm bottom-0 min-h-3/6">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start text-slate-700 group-hover:text-brand-100">
                        <span className="mr-2 font-bold text-brand-500 group-hover:text-white">✓</span>
                        {feature}
                    </li>
                ))}
            </ul>
            
            <a 
                className="mt-4 block text-center px-5 py-3 rounded-full font-semibold transition-colors duration-200 
                        bg-brand-500 text-white hover:bg-brand-600 
                        group-hover:bg-white group-hover:text-brand-500 group-hover:hover:bg-brand-100"
                href="/cadastro"
                onClick={handleClick}
            >
                Escolher Plano
            </a>
        </div>
    )
};

export default PlanCard;