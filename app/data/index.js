import { generateNearbyLocations } from '../utils/getAroundLocations'


export async function generateBoardData(storedLat, storedLng, radiusKm = 15) {
    try {
        const storedLat = parseFloat(localStorage.getItem("userLat"));
        const storedLng = parseFloat(localStorage.getItem("userLong"));

        if (!storedLat || !storedLng) {
            throw new Error("User coordinates not found in localStorage");
        }

        const locations = await generateNearbyLocations(storedLat, storedLng, radiusKm);
        const boardData = [
            {
                location: locations,
                postType: [
                    {
                        name: 'job offered',
                        categories: [
                            { name: 'accounting/finance' },
                            { name: 'admin/office' },
                            { name: 'architect/engineer/cad' },
                            { name: 'art/media/design' },
                            { name: 'business/mgmt' },
                            { name: 'customer service' },
                            { name: 'education/teaching' },
                            { name: 'et cetera' },
                            { name: 'food/beverage/hospitality' },
                            { name: 'general labor' },
                            { name: 'government' },
                            { name: 'healthcare' },
                            { name: 'human resource' },
                            { name: 'legal/paralegal' },
                            { name: 'manufacturing' },
                            { name: 'marketing/advertising/pr' },
                            { name: 'nonprofit' },
                            { name: 'real estate' },
                            { name: 'retail/wholesale' },
                            { name: 'sales' },
                            { name: 'salon/spa/fitness' },
                            { name: 'science/biotech' },
                            { name: 'security' },
                            { name: 'skilled trades/artisan' },
                            { name: 'software/qa/dba/etc' },
                            { name: 'systems/networking' },
                            { name: 'technical support' },
                            { name: 'transportation' },
                            { name: 'tv/film/video/radio' },
                            { name: 'web/html/info design' },
                            { name: 'writing/editing' }
                        ],
                        details: {
                            employmentType: '',
                            experienceLevel: '',
                            jobTitle: '',
                            compensation: '',
                            companyName: '',
                            jobOptions: [],
                        }
                    },

                    {
                        name: 'gig offered',
                        categories: [
                            {
                                name: 'I want to hire someone',
                                subCategories: [
                                    {
                                        name: 'computer gigs ($10)',
                                        description: 'small web design, tech support, etc projects'
                                    },
                                    {
                                        name: 'creative gigs ($10)',
                                        description: 'small design, photography, illustration projects'
                                    },
                                    {
                                        name: 'crew gigs ($10)',
                                        description: 'low budget film/theatre opportunities EXCEPT acting, which go under "talent"'
                                    },
                                    {
                                        name: 'domestic gigs ($10)',
                                        description: 'cleaning, babysitting, home care, tutoring, personal training, etc'
                                    },
                                    {
                                        name: 'event gigs ($10)',
                                        description: 'promotions, catering, wedding photography, etc'
                                    },
                                    {
                                        name: 'labor gigs ($10)',
                                        description: 'includes moving & hauling'
                                    },
                                    {
                                        name: 'talent gigs ($10)',
                                        description: 'acting, modeling, music, dance, etc'
                                    },
                                    {
                                        name: 'writing gigs ($10)',
                                        description: 'includes editing & translation'
                                    }
                                ]
                            },
                            {
                                name: 'I have a service to offer',
                                subCategories: [
                                    { name: 'automotive services ($5)' },
                                    { name: 'beauty services ($5)' },
                                    { name: 'cell phone / mobile services ($5)' },
                                    { name: 'computer services ($5)' },
                                    { name: 'creative services ($5)' },
                                    { name: 'cycle services ($5)' },
                                    { name: 'event services ($5)' },
                                    { name: 'farm & garden services ($5)' },
                                    { name: 'financial services ($5)' },
                                    { name: 'health/wellness services ($5)' },
                                    { name: 'household services ($5)' },
                                    { name: 'labor / hauling / moving ($5)' },
                                    { name: 'legal services ($5)' },
                                    { name: 'lessons & tutoring ($5)' },
                                    { name: 'marine services ($5)' },
                                    { name: 'pet services ($5)' },
                                    { name: 'real estate services ($5)' },
                                    { name: 'skilled trade services ($5)' },
                                    { name: 'small biz ads ($5)' },
                                    { name: 'travel/vacation services ($5)' },
                                    { name: 'writing / editing / translation ($5)' }
                                ]
                            }
                        ],
                        details: {
                            directHRContact: false,
                            pay: false,
                            jobTitle: '',
                            compensation: '',
                        }
                    },

                    {
                        name: 'resume / job wanted',
                        categories: [
                            {
                                name: "I'm an individual seeking employment",
                                subCategories: []
                            },
                            {
                                name: "I'm offering or advertising a service",
                                subCategories: [
                                    { name: 'automotive services ($5)' },
                                    { name: 'beauty services ($5)' },
                                    { name: 'cell phone / mobile services ($5)' },
                                    { name: 'computer services ($5)' },
                                    { name: 'creative services ($5)' },
                                    { name: 'cycle services ($5)' },
                                    { name: 'event services ($5)' },
                                    { name: 'farm & garden services ($5)' },
                                    { name: 'financial services ($5)' },
                                    { name: 'health/wellness services ($5)' },
                                    { name: 'household services ($5)' },
                                    { name: 'labor / hauling / moving ($5)' },
                                    { name: 'legal services ($5)' },
                                    { name: 'lessons & tutoring ($5)' },
                                    { name: 'marine services ($5)' },
                                    { name: 'pet services ($5)' },
                                    { name: 'real estate services ($5)' },
                                    { name: 'skilled trade services ($5)' },
                                    { name: 'small biz ads ($5)' },
                                    { name: 'travel/vacation services ($5)' },
                                    { name: 'writing / editing / translation ($5)' }
                                ]
                            },
                            {
                                name: "I'm offering a job",
                                subCategories: [
                                    { name: 'accounting/finance' },
                                    { name: 'admin/office' },
                                    { name: 'architect/engineer/cad' },
                                    { name: 'art/media/design' },
                                    { name: 'business/mgmt' },
                                    { name: 'customer service' },
                                    { name: 'education/teaching' },
                                    { name: 'et cetera' },
                                    { name: 'food/beverage/hospitality' },
                                    { name: 'general labor' },
                                    { name: 'government' },
                                    { name: 'healthcare' },
                                    { name: 'human resource' },
                                    { name: 'legal/paralegal' },
                                    { name: 'manufacturing' },
                                    { name: 'marketing/advertising/pr' },
                                    { name: 'nonprofit' },
                                    { name: 'real estate' },
                                    { name: 'retail/wholesale' },
                                    { name: 'sales' },
                                    { name: 'salon/spa/fitness' },
                                    { name: 'science/biotech' },
                                    { name: 'security' },
                                    { name: 'skilled trades/artisan' },
                                    { name: 'software/qa/dba/etc' },
                                    { name: 'systems/networking' },
                                    { name: 'technical support' },
                                    { name: 'transportation' },
                                    { name: 'tv/film/video/radio' },
                                    { name: 'web/html/info design' },
                                    { name: 'writing/editing' }
                                ]
                            },
                            {
                                name: "I'm offering childcare",
                                subCategories: []
                            },
                        ],
                        details: {
                            individualSeekingEmployment: {
                                availability: '',
                                directHRContact: false,
                                education: '',
                                licensed: false,
                            },
                            offeringJob: {
                                employmentType: '',
                                experienceLevel: '',
                                jobTitle: '',
                                compensation: '',
                                companyName: '',
                                jobOptions: [],
                            },
                            offeringChildcare: {
                                ageAccepted: '',
                                availability: '',
                                providerType: '',
                            },
                        }
                    },
                    {
                        name: 'housing offered',
                        categories: [
                            { name: 'rooms & shares' },
                            { name: 'apartments / housing for rent (no shares, roommates, or sublets please!)' },
                            { name: 'housing swap' },
                            { name: 'office & commercial ($5)' },
                            { name: 'parking & storage' },
                            { name: 'real estate - by broker' },
                            { name: 'real estate - by owner' },
                            { name: 'sublets & temporary' },
                            { name: 'vacation rentals' }
                        ],
                        details: {
                            per: false,
                            sqft: '',
                            privateRoom: false,
                            housingType: '',
                            privateBath: false,
                            laundary: false,
                            parking: false,
                            bedrooms: '',
                            bathrooms: '',
                            additional: [],
                            availableOn: ''
                        }
                    },
                    {
                        name: 'housing wanted',
                        categories: [
                            { name: 'wanted: apts' },
                            { name: 'wanted: real estate' },
                            { name: 'wanted: room/share' },
                            { name: 'wanted: sublet/temp' }
                        ]
                    },
                    {
                        name: 'for sale by owner',
                        categories: [
                            { name: 'antiques' },
                            { name: 'appliances' },
                            { name: 'arts & crafts' },
                            { name: 'atvs, utvs, snowmobiles' },
                            { name: 'auto parts' },
                            { name: 'auto wheels & tires' },
                            { name: 'aviation' },
                            { name: 'baby & kid stuff' },
                            { name: 'barter' },
                            { name: 'bicycle parts' },
                            { name: 'bicycles' },
                            { name: 'boat parts' },
                            { name: 'boats' },
                            { name: 'books & magazines' },
                            { name: 'business/commercial' },
                            { name: 'cars & trucks ($5)' },
                            { name: 'cds / dvds / vhs' },
                            { name: 'cell phones' },
                            { name: 'clothing & accessories' },
                            { name: 'collectibles' },
                            { name: 'computer parts' },
                            { name: 'computers' },
                            { name: 'electronics' },
                            { name: 'farm & garden' },
                            { name: 'free stuff' },
                            { name: 'furniture' },
                            { name: 'garage & moving sales' },
                            { name: 'general for sale' },
                            { name: 'health and beauty' },
                            { name: 'heavy equipment' },
                            { name: 'household items' },
                            { name: 'jewelry' },
                            { name: 'materials' },
                            { name: 'motorcycle parts' },
                            { name: 'motorcycles/scooters ($5)' },
                            { name: 'musical instruments' },
                            { name: 'photo/video' },
                            { name: 'rvs ($5)' },
                            { name: 'sporting goods' },
                            { name: 'tickets' },
                            { name: 'tools' },
                            { name: 'toys & games' },
                            { name: 'trailers' },
                            { name: 'video gaming' },
                            { name: 'wanted' }
                        ],
                        details: {
                            manufacturer: '',
                            modelNumber: '',
                            size: '',
                            condition: '',
                            langauge: '',
                            additional: []
                        }
                    },
                    {

                        name: 'for sale by dealer',
                        categories: [
                            { name: 'antiques' },
                            { name: 'appliances' },
                            { name: 'arts & crafts' },
                            { name: 'atvs, utvs, snowmobiles' },
                            { name: 'auto parts' },
                            { name: 'auto wheels & tires' },
                            { name: 'aviation' },
                            { name: 'baby & kid stuff' },
                            { name: 'bicycle parts' },
                            { name: 'bicycles' },
                            { name: 'boat parts' },
                            { name: 'boats' },
                            { name: 'books & magazines' },
                            { name: 'business/commercial' },
                            { name: 'cars & trucks' },
                            { name: 'cds / dvds / vhs' },
                            { name: 'cell phones' },
                            { name: 'clothing & accessories' },
                            { name: 'collectibles' },
                            { name: 'computer parts' },
                            { name: 'computers' },
                            { name: 'electronics' },
                            { name: 'farm & garden' },
                            { name: 'furniture' },
                            { name: 'general for sale' },
                            { name: 'health and beauty' },
                            { name: 'heavy equipment' },
                            { name: 'household items' },
                            { name: 'jewelry' },
                            { name: 'materials' },
                            { name: 'motorcycle parts' },
                            { name: 'motorcycles/scooters' },
                            { name: 'musical instruments' },
                            { name: 'photo/video' },
                            { name: 'rvs' },
                            { name: 'sporting goods' },
                            { name: 'tickets' },
                            { name: 'tools' },
                            { name: 'toys & games' },
                            { name: 'trailers' },
                            { name: 'video gaming' },
                            { name: 'wanted' }
                        ],
                        details: {
                            size: '',
                            condition: '',
                            langauge: '',
                            additional: []
                        }
                    },
                    {
                        name: 'wanted by owner',
                        categories: [
                            { name: 'owner' },
                        ],
                        details: {
                            size: '',
                            condition: '',
                            langauge: '',
                            additional: []
                        }
                    },
                    {
                        name: 'wanted by dealer',
                       categories: [
                            { name: 'dealer' },
                        ],
                        details: {
                            size: '',
                            condition: '',
                            langauge: '',
                            additional: []
                        }
                    },
                    {
                        name: 'service offered',
                        categories: [
                            { name: 'automotive services ($5)' },
                            { name: 'beauty services ($5)' },
                            { name: 'cell phone / mobile services ($5)' },
                            { name: 'computer services ($5)' },
                            { name: 'creative services ($5)' },
                            { name: 'cycle services ($5)' },
                            { name: 'event services ($5)' },
                            { name: 'farm & garden services ($5)' },
                            { name: 'financial services ($5)' },
                            { name: 'health/wellness services ($5)' },
                            { name: 'household services ($5)' },
                            { name: 'labor / hauling / moving ($5)' },
                            { name: 'legal services ($5)' },
                            { name: 'lessons & tutoring ($5)' },
                            { name: 'marine services ($5)' },
                            { name: 'pet services ($5)' },
                            { name: 'real estate services ($5)' },
                            { name: 'skilled trade services ($5)' },
                            { name: 'small biz ads ($5)' },
                            { name: 'travel/vacation services ($5)' },
                            { name: 'writing / editing / translation ($5)' }
                        ]
                    },
                    {
                        name: 'community',
                        categories: [
                            { name: 'activity partners' },
                            { name: 'artists' },
                            { name: 'childcare' },
                            { name: 'general community' },
                            { name: 'groups' },
                            { name: 'local news and views' },
                            { name: 'lost & found' },
                            { name: 'missed connections' },
                            { name: 'musicians' },
                            { name: 'pets' },
                            { name: 'politics' },
                            { name: 'rants & raves' },
                            { name: 'rideshare' },
                            { name: 'volunteers' }
                        ]
                    },
                    {
                        name: 'event / class',
                        categories: [
                            {
                                name: "I'm selling a small number of tickets to an event",
                                subCategories: []
                            },
                            {
                                name: "My business is having a sale",
                                subCategories: [
                                    { name: 'antiques ($5)' },
                                    { name: 'antiques' },
                                    { name: 'appliances ($5)' },
                                    { name: 'appliances' },
                                    { name: 'arts & crafts ($5)' },
                                    { name: 'arts & crafts' },
                                    { name: 'atvs, utvs, snowmobiles ($5)' },
                                    { name: 'atvs, utvs, snowmobiles' },
                                    { name: 'auto parts ($5)' },
                                    { name: 'auto parts' },
                                    { name: 'auto wheels & tires ($5)' },
                                    { name: 'auto wheels & tires' },
                                    { name: 'aviation ($5)' },
                                    { name: 'aviation' },
                                    { name: 'baby & kid stuff ($5)' },
                                    { name: 'baby & kid stuff' },
                                    { name: 'barter' },
                                    { name: 'bicycle parts ($5)' },
                                    { name: 'bicycle parts' },
                                    { name: 'bicycles ($5)' },
                                    { name: 'bicycles' },
                                    { name: 'boat parts ($5)' },
                                    { name: 'boat parts' },
                                    { name: 'boats ($5)' },
                                    { name: 'boats' },
                                    { name: 'books & magazines ($5)' },
                                    { name: 'books & magazines' },
                                    { name: 'business/commercial ($5)' },
                                    { name: 'business/commercial' },
                                    { name: 'cars & trucks ($5)' },
                                    { name: 'cds / dvds / vhs ($5)' },
                                    { name: 'cds / dvds / vhs' },
                                    { name: 'cell phones ($5)' },
                                    { name: 'cell phones' },
                                    { name: 'clothing & accessories ($5)' },
                                    { name: 'clothing & accessories' },
                                    { name: 'collectibles ($5)' },
                                    { name: 'collectibles' },
                                    { name: 'computer parts ($5)' },
                                    { name: 'computer parts' },
                                    { name: 'computers ($5)' },
                                    { name: 'computers' },
                                    { name: 'electronics ($5)' },
                                    { name: 'electronics' },
                                    { name: 'farm & garden ($5)' },
                                    { name: 'farm & garden' },
                                    { name: 'free stuff' },
                                    { name: 'furniture ($5)' },
                                    { name: 'furniture' },
                                    { name: 'garage & moving sales' },
                                    { name: 'general for sale ($5)' },
                                    { name: 'general for sale' },
                                    { name: 'health and beauty ($5)' },
                                    { name: 'health and beauty' },
                                    { name: 'heavy equipment ($5)' },
                                    { name: 'heavy equipment' },
                                    { name: 'household items ($5)' },
                                    { name: 'household items' },
                                    { name: 'jewelry ($5)' },
                                    { name: 'jewelry' },
                                    { name: 'materials ($5)' },
                                    { name: 'materials' },
                                    { name: 'motorcycle parts ($5)' },
                                    { name: 'motorcycle parts' },
                                    { name: 'motorcycles/scooters ($5)' },
                                    { name: 'musical instruments ($5)' },
                                    { name: 'musical instruments' },
                                    { name: 'photo/video ($5)' },
                                    { name: 'photo/video' },
                                    { name: 'rvs ($5)' },
                                    { name: 'sporting goods ($5)' },
                                    { name: 'sporting goods' },
                                    { name: 'tickets ($5)' },
                                    { name: 'tickets' },
                                    { name: 'tools ($5)' },
                                    { name: 'tools' },
                                    { name: 'toys & games ($5)' },
                                    { name: 'toys & games' },
                                    { name: 'trailers ($5)' },
                                    { name: 'trailers' },
                                    { name: 'video gaming ($5)' },
                                    { name: 'video gaming' },
                                    { name: 'wanted ($5)' },
                                    { name: 'wanted' }
                                ]
                            },
                            {
                                name: "I'm offering an event-related service (rentals, transportation, etc.)",
                                subCategories: []
                            },
                            {
                                name: "I'm advertising a garage sale, estate sale, moving sale, flea market, or other non-corporate sale",
                                subCategories: []
                            },
                            {
                                name: "I'm advertising a class or training session",
                                subCategories: []
                            },
                            {
                                name: "I'm advertising an event, other than the above",
                                subCategories: []
                            }
                        ],
                        details: {
                            sellingTickets: {
                                numberOfTicktsAvailble: '',
                                venue: '',
                                langauge: '',
                                eventData: '',
                                additional: []
                            },
                            businessHavingSale: {
                                manufacturer: '',
                                modelNumber: '',
                                size: '',
                                condition: '',
                                langauge: '',
                                additional: []
                            },
                            advertisingSales: {
                                startTime: '',
                                langauge: '',
                                additional: []
                            },
                            advertisingClass: {
                                eventStartDate: '',
                                duration: '',
                            },
                            advertisingEvent: {
                                venue: '',
                                eventStartDate: '',
                                duration: '',
                                eventFeatures: []
                            }
                        }
                    },
                ]
            }
        ];

        return boardData;
    } catch (error) {
        console.error("Error generating board data:", error.message);
        return null;
    }
}