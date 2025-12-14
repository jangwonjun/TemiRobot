export interface MenuItem {
    id: number
    category: string
    name: string
    price: number
    description: string
    imageColor?: string
    imagePath?: string
    hasSpiciness?: boolean
    availableAllergies?: string[]
}

export interface CartItem {
    uid: string
    menuId: number
    name: string
    price: number
    options: {
        spiciness?: number
        allergies?: string[]
    }
}

export const CATEGORIES = ['메인', '사이드', '음료', '주류']

export const MENU_ITEMS: MenuItem[] = [
    // --- MAIN ---
    {
        id: 1,
        category: '메인',
        name: '해물 순두부찌개',
        price: 10000,
        description: '얼큰하고 시원한 국물이 일품인 팡씨네 대표 메뉴',
        imagePath: '/images/menu/sundubu.png',
        hasSpiciness: true,
        availableAllergies: ['새우', '조개', '계란']
    },
    {
        id: 2,
        category: '메인',
        name: '강된장 보리밥',
        price: 9000,
        description: '구수한 강된장과 신선한 야채의 조화',
        imagePath: '/images/menu/boribap.png',
        availableAllergies: ['대두', '참기름']
    },
    {
        id: 10,
        category: '메인',
        name: '육전',
        price: 15000,
        description: '계란옷 입혀 노릇하게 구워낸 소고기 육전',
        imagePath: '/images/menu/yukjeon.png',
        availableAllergies: ['계란', '소고기']
    },
    {
        id: 11,
        category: '메인',
        name: '치즈 감자전',
        price: 13000,
        description: '바삭한 감자채와 고소한 치즈의 만남',
        imagePath: '/images/menu/potato_pancake.png',
        availableAllergies: ['치즈', '감자']
    },
    {
        id: 12,
        category: '메인',
        name: '마약 옥수수전',
        price: 12000,
        description: '달콤 짭짤한 옥수수 알갱이가 톡톡 터지는 전',
        imagePath: '/images/menu/corn_pancake.png',
        availableAllergies: ['옥수수', '우유']
    },
    {
        id: 13,
        category: '메인',
        name: '두부김치',
        price: 16000,
        description: '따뜻한 손두부와 매콤달콤 볶음김치',
        imagePath: '/images/menu/dubu_kimchi.png',
        availableAllergies: ['돼지고기', '두부', '참기름']
    },
    {
        id: 14,
        category: '메인',
        name: '차돌 된장찌개',
        price: 9000,
        description: '차돌박이가 듬뿍 들어간 구수한 시골 된장찌개',
        imagePath: '/images/menu/chadol_doenjang.png',
        hasSpiciness: true,
        availableAllergies: ['대두', '소고기']
    },

    // --- SIDE ---
    {
        id: 25,
        category: '사이드',
        name: '옛날 떡볶이',
        price: 6000,
        description: '매콤달콤한 추억의 학교 앞 떡볶이',
        imagePath: '/images/menu/tteokbokki.png',
        hasSpiciness: true,
        availableAllergies: ['밀가루', '대파']
    },
    {
        id: 4,
        category: '사이드',
        name: '메밀전병',
        price: 7000,
        description: '매콤한 김치소가 꽉 찬 메밀전병',
        imagePath: '/images/menu/memil_jeon.png',
        availableAllergies: ['메밀', '김치', '돼지고기']
    },
    {
        id: 20,
        category: '사이드',
        name: '계란후라이 (3개)',
        price: 3000,
        description: '들기름에 구워 더욱 고소한 반숙 후라이',
        imagePath: '/images/menu/fried_eggs.png',
        availableAllergies: ['계란']
    },
    {
        id: 21,
        category: '사이드',
        name: '스팸구이',
        price: 5000,
        description: '밥도둑 스팸을 노릇노릇하게 구워냈어요',
        imagePath: '/images/menu/spam.png',
        availableAllergies: ['돼지고기']
    },
    {
        id: 22,
        category: '사이드',
        name: '도토리묵 무침',
        price: 8000,
        description: '새콤달콤한 양념과 아삭한 오이의 조화',
        imagePath: '/images/menu/acorn_jelly.png',
        availableAllergies: ['참기름', '견과류']
    },

    // --- DRINKS ---
    {
        id: 5,
        category: '음료',
        name: '콜라',
        price: 2000,
        description: '코카콜라 355ml',
        imagePath: '/images/menu/coke.png',
        imageColor: '#000000'
    },
    {
        id: 30,
        category: '음료',
        name: '제로 콜라',
        price: 2000,
        description: '부담 없는 코카콜라 제로 355ml',
        imagePath: '/images/menu/zero_coke.png',
        imageColor: '#212121'
    },
    {
        id: 31,
        category: '음료',
        name: '사이다',
        price: 2000,
        description: '칠성사이다 355ml',
        imagePath: '/images/menu/cider.png',
        imageColor: '#4caf50'
    },
    {
        id: 32,
        category: '음료',
        name: '환타 파인',
        price: 2000,
        description: '환타 파인애플맛 355ml',
        imagePath: '/images/menu/fanta.png',
        imageColor: '#ff9800'
    },

    // --- ALCOHOL ---
    {
        id: 6,
        category: '주류',
        name: '소주',
        price: 5000,
        description: '참이슬 / 처음처럼 / 진로 (택1 가능)',
        imagePath: '/images/menu/soju.png',
        imageColor: '#81c784'
    },
    {
        id: 40,
        category: '주류',
        name: '생막걸리',
        price: 4000,
        description: '장수 생막걸리',
        imagePath: '/images/menu/makgeolli.png',
        imageColor: '#f0f4c3'
    },
    {
        id: 41,
        category: '주류',
        name: '병맥주',
        price: 5000,
        description: '테라 / 카스 (택1 가능)',
        imagePath: '/images/menu/beer.png',
        imageColor: '#ffb74d'
    }
]
