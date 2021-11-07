
const CONVERSION_FACTORY =  'The Conversion Factory';

const CARD_NAMES = [
    {id:"0001", name:"PMO Dashboard",
    title:"Monitering", 
    navigate: '/pmo',
    content1:'Serves as a powerful visual and analytical tool for Program Managers to monitor progress across lines of business and workstreams',
    content2:      `Drill-down capabilities provide visibility into bottlenecks; alerts stakeholders to issues and approaching deadlines`},
    {id:"0002", name:"Exception Management",title:"Support", 
    navigate: '/exception',
            content1:
            'Monitors and  displays the status of open and resolved exceptions;                    ',
            content2 :' Hyperlinks enable a user to drill-down, view and proactively manage exceptions;'
        },
     {id:"0003", name:"Reconciliation",title:"Contract Management", 
     navigate: '/recon',
       content1: 'Enables proactive management of breaks there by enhancing post-trade processing;',
       content2: 'AI and ML capabilities enhance the comparison of data sets;',
    },
   //  {id:"0004", name:"IE",title:"Invoice Extraction", content:"Package workflow for invoice extraction"}
];

export {
    CARD_NAMES,
    CONVERSION_FACTORY
};