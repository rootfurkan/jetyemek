// Premium static and initial dynamic datasets for CraveDash App
export const INITIAL_USER = {
  name: "Ahmet",
  surname: "Yılmaz",
  email: "ahmet.yilmaz@gmail.com",
  phone: "0532 123 45 67",
  birthdate: "15.05.1988",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1OnzU0H07Jl19OAJhRmnrjZ1nAia79SjMtiOy3icj_YvZO5DNspysFfERiG-MU5GAqwRkXTj-VdE5FNzuC503l8VsgNko6DqRo3LlwHUacAkoepZaI4yDBXXY4qRe44OrrodkHRwmf9nEd3gnRjdgAgTorRBJeWhqfVu9Q9BWI8BafCM9juKMCEArpEvFb5Czp_JVB6lLvLJxMMRdTywYRRpHSle7Bg_4btImvyUWekAuCeN2AcTlYQ"
};

export const INITIAL_ADDRESSES = [
  {
    id: 1,
    title: "Ev",
    details: "Atatürk Mah. Sütçü İmam Cad. No:45 D:8 Ümraniye, İstanbul",
    icon: "home"
  },
  {
    id: 2,
    title: "İş",
    details: "Levent Mah. Büyükdere Cad. No:193 K:12 Beşiktaş, İstanbul",
    icon: "work"
  }
];

export const INITIAL_CARDS = [
  {
    id: 1,
    name: "Maaş Kartım",
    type: "Mastercard",
    number: "4291",
    expiry: "08/26",
    isDefault: true,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCepLVd8hsizjFucB5HUGRh9P5WIbXle5yDNhxbFZ4IUL4x-UUkzX8Twd9ThLtYulSUXTlhtuaaVFRS4E8y5h0Ced3Fz_jI3E5m4xVrkEaQF6VNkeccJLSAtlN4ITJwO_hYI8F-o-V5HRmx33xv3iuacoJjXQWrraAK8fMmgFSeJPme2Oz95nnutZMot7FnWfo_9W0yzrvN_Goq-eetI761mTfWrpRY5le3T5J84fwXs1hlITDhkgaqKA"
  },
  {
    id: 2,
    name: "Kredi Kartı",
    type: "Visa",
    number: "8852",
    expiry: "11/25",
    isDefault: false,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHQVFbGuXYR69Yf-GNnywtqpwzCkHMwBpL6ZZ6h4SdtqFJcEoy6119eRON1z7sfhQnyZDCF_pJbHR6MbTUVAclhpk_ihlKrlrw2SLeL12VS-9noEP5rLnLZ6h9pwAS088OmcXR9LtdoT4Itk-fhhrSRiYInxW__VeoIx4vabjI4s1p93n2hEkUqg8slUDKQ5NdYWEqKpygeGleqadagqDYSbT483UWXQ_w8x6csqaWbG1rXSToszFwNQ"
  },
  {
    id: 3,
    name: "Yemek Kartı",
    type: "Troy",
    number: "1024",
    expiry: "04/27",
    isDefault: false,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLelAgxpKLxx0GanhzDVSzQhxrz60C6J5aMlVsXXABIhdJvrKukQjpRc6hCKy6r1W1qap8gzXhmMPbW-3W_n8RTM7lmUMvBkT7P8rSLW0ITqspe8dXjqUhr-FDCv_H5aXzuEEEcrKiMa7bjj29OIAzIE9jr-6dwD7weg4YCMEI1VCCr4DXb7Hd7zB-XGY-i-PPMWphcZZtSGzxHe2WLjfxHPSwhrhtzf5GxFweYc5GbNcezzcgjQZ8Wg"
  }
];

export const FOOD_CATEGORIES = [
  { id: "hamburger", name: "Hamburger", icon: "lunch_dining" },
  { id: "kebap", name: "Kebap", icon: "bakery_dining" }, // using icon from design screenshot
  { id: "pizza", name: "Pizza", icon: "local_pizza" },
  { id: "tatli", name: "Tatlı", icon: "icecream" },
  { id: "vegan", name: "Vegan", icon: "eco" },
  { id: "cigkofte", name: "Çiğ Köfte", icon: "restaurant_menu" },
  { id: "doner", name: "Döner", icon: "kebab_dining" },
  { id: "evyemekleri", name: "Ev Yemekleri", icon: "home_storage" }
];

export const SPONSOR_RESTAURANTS = [
  {
    id: "gourmet-burger",
    name: "Gourmet Burger House",
    rating: "4.9",
    time: "20-30 dk",
    deliveryFee: "Ücretsiz",
    category: "Hamburger & Pizza",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdjrsT9Ktj1yZGgop0d8nrS1TsyeJIP4RonQZLlchh1vlAM3nmjFdF6UNKbgug-T12zhD7iCHI9cGKLIZrOfuHK1x8_pul3qzJ4_sjG1yQXWPNmAe43xo7PvPFVy7QSqmCguNviM-K3-Ww1N4kJVBm5-gV2c8u451IRcAV6kTEWilXjikql8G4_3f9Ys9tLQQx0zKehgs4zJDZvBqbEV2XnxJnE3QzIwghdO9OKBBTzSyY6lbAV0r7xSoXwwphKDnMC3uGq2w8XjA",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbFlmGUJoFqTdp_jj1c_h9q9nHWfua_407ovHmjpcgVSjMMJHdZzWRfQAfyF-7W7zedVonUz_0hGgC0xWv5ELAjQpUB5gOH75fWXWzTu9CwkuHItfDaqRqTgfG4mCp3-yZIdmkyeJxHILqjP2UuG7sWmRqq2FoiJSf2cnGTyO_dK9vatCfnz3oB7A-JPSMp223cPtz4wu0jLv6zH3HlmjYRT_ftlM0FTEWpQ5tPsPlFLc7EddyiS6KxhI33yDZJYZq1WdSNqmIu5A"
  },
  {
    id: "lezzet-sofrasi",
    name: "Lezzet Sofrası",
    rating: "4.8",
    time: "35-45 dk",
    deliveryFee: "Ücretsiz",
    category: "Ev Yemekleri",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U"
  },
  {
    id: "sushi-art",
    name: "Sushi Art",
    rating: "4.9",
    time: "15-25 dk",
    deliveryFee: "Ücretsiz",
    category: "Uzak Doğu",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgJskehVzS9BXb-zghBS9HLVHOth4DovGk2ifhU7yX3zrm3vef69bY898FXo02V51WWpqE8KG1TTPd1tLC5iaXz5xIgpPJjuFXIUyAl0XjjZconmkrkvfZ0mkoOoUBQIgbVuDXM9ckBkIxqMQGp_SWAC3rOUP0vUdj_18olHos9uB3vxSigbrxUblI50MmFnPLZRO2wyRiyt7I9EeFD8qGfs0fzN1K9B7bjmSkciCrtPuDoYrfGWsnfyoxeo-XvLmoezwLHUm4hT0"
  },
  {
    id: "pizza-house",
    name: "Pizza House",
    rating: "4.7",
    time: "40-50 dk",
    deliveryFee: "Ücretsiz",
    category: "Pizza",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_9qNfE-u58U_qE3PZ8-Jv8uP0Vn_L7S_5XQZ-R4V0-L7S_5XQZ-R4V0-L7S_5XQZ-R4V0-L7S_5XQZ-R4V0"
  }
];

export const RESTAURANT_GRID = [
  {
    id: "burger-empire",
    name: "Burger Empire",
    rating: "4.7",
    time: "30-40 dk",
    minOrder: "150 TL",
    category: "Fast Food",
    tag: "hamburger",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdjrsT9Ktj1yZGgop0d8nrS1TsyeJIP4RonQZLlchh1vlAM3nmjFdF6UNKbgug-T12zhD7iCHI9cGKLIZrOfuHK1x8_pul3qzJ4_sjG1yQXWPNmAe43xo7PvPFVy7QSqmCguNviM-K3-Ww1N4kJVBm5-gV2c8u451IRcAV6kTEWilXjikql8G4_3f9Ys9tLQQx0zKehgs4zJDZvBqbEV2XnxJnE3QzIwghdO9OKBBTzSyY6lbAV0r7xSoXwwphKDnMC3uGq2w8XjA",
    isOpen: true
  },
  {
    id: "pasta-amore",
    name: "Pasta Amore",
    rating: "4.6",
    time: "40-50 dk",
    minOrder: "200 TL",
    category: "İtalyan",
    tag: "pizza",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U",
    isOpen: false
  },
  {
    id: "donerci-vedat",
    name: "Dönerci Vedat",
    rating: "4.9",
    time: "20-30 dk",
    minOrder: "100 TL",
    category: "Döner",
    tag: "doner",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdjrsT9Ktj1yZGgop0d8nrS1TsyeJIP4RonQZLlchh1vlAM3nmjFdF6UNKbgug-T12zhD7iCHI9cGKLIZrOfuHK1x8_pul3qzJ4_sjG1yQXWPNmAe43xo7PvPFVy7QSqmCguNviM-K3-Ww1N4kJVBm5-gV2c8u451IRcAV6kTEWilXjikql8G4_3f9Ys9tLQQx0zKehgs4zJDZvBqbEV2XnxJnE3QzIwghdO9OKBBTzSyY6lbAV0r7xSoXwwphKDnMC3uGq2w8XjA",
    isOpen: true
  },
  {
    id: "sushi-master",
    name: "Sushi Master",
    rating: "4.4",
    time: "45-55 dk",
    minOrder: "350 TL",
    category: "Uzak Doğu",
    tag: "vegan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U",
    isOpen: false
  },
  {
    id: "vegan-garden",
    name: "Vegan Garden",
    rating: "4.8",
    time: "30-40 dk",
    minOrder: "180 TL",
    category: "Vegan",
    tag: "vegan",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgJskehVzS9BXb-zghBS9HLVHOth4DovGk2ifhU7yX3zrm3vef69bY898FXo02V51WWpqE8KG1TTPd1tLC5iaXz5xIgpPJjuFXIUyAl0XjjZconmkrkvfZ0mkoOoUBQIgbVuDXM9ckBkIxqMQGp_SWAC3rOUP0vUdj_18olHos9uB3vxSigbrxUblI50MmFnPLZRO2wyRiyt7I9EeFD8qGfs0fzN1K9B7bjmSkciCrtPuDoYrfGWsnfyoxeo-XvLmoezwLHUm4hT0",
    isOpen: true
  },
  {
    id: "pizza-express",
    name: "Pizza Express",
    rating: "4.5",
    time: "25-35 dk",
    minOrder: "220 TL",
    category: "Pizza",
    tag: "pizza",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdjrsT9Ktj1yZGgop0d8nrS1TsyeJIP4RonQZLlchh1vlAM3nmjFdF6UNKbgug-T12zhD7iCHI9cGKLIZrOfuHK1x8_pul3qzJ4_sjG1yQXWPNmAe43xo7PvPFVy7QSqmCguNviM-K3-Ww1N4kJVBm5-gV2c8u451IRcAV6kTEWilXjikql8G4_3f9Ys9tLQQx0zKehgs4zJDZvBqbEV2XnxJnE3QzIwghdO9OKBBTzSyY6lbAV0r7xSoXwwphKDnMC3uGq2w8XjA",
    isOpen: true
  },
  {
    id: "ev-lezzetleri",
    name: "Ev Lezzetleri",
    rating: "4.7",
    time: "35-45 dk",
    minOrder: "120 TL",
    category: "Ev Yemekleri",
    tag: "evyemekleri",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U",
    isOpen: true
  },
  {
    id: "cig-kofteci-omer",
    name: "Çiğ Köfteci Ömer",
    rating: "4.6",
    time: "15-25 dk",
    minOrder: "80 TL",
    category: "Çiğ Köfte",
    tag: "cigkofte",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgJskehVzS9BXb-zghBS9HLVHOth4DovGk2ifhU7yX3zrm3vef69bY898FXo02V51WWpqE8KG1TTPd1tLC5iaXz5xIgpPJjuFXIUyAl0XjjZconmkrkvfZ0mkoOoUBQIgbVuDXM9ckBkIxqMQGp_SWAC3rOUP0vUdj_18olHos9uB3vxSigbrxUblI50MmFnPLZRO2wyRiyt7I9EeFD8qGfs0fzN1K9B7bjmSkciCrtPuDoYrfGWsnfyoxeo-XvLmoezwLHUm4hT0",
    isOpen: true
  }
];

export const GOURMET_MENU = [
  {
    id: "signature-truffle-burger",
    name: "Signature Truffle Burger",
    price: 245,
    description: "Double beef patty, truffle mayo, caramelized onions, melted brie, and wild mushrooms.",
    time: "20-25 dk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy2joy79cLjE53ZVVj-QcyGtU5VHGUGaD33pQPIl1VQLu1mqIulTj6EY9tO7pJr116jgfbOH6tWIxCgLwBOAPOut8gQxD1aayUXF3lXxwj4rI7RGMch6go3o-WiqMJWYe1lyK-K0OG18rfo5tc9MECoNuAJXrMl1A_VzL2N65vbRLX1F-FYpHxdDWSJSZvciViNoKdy-G8l-F_K1o2_4_7cHkF-0I1AHpx37qc1xmCEgfmPNv-Fg10j1ynyHuOoS8IiuOt1tbz5S8",
    category: "Popüler",
    tag: "Popüler"
  },
  {
    id: "classic-margherita",
    name: "Classic Margherita",
    price: 180,
    description: "Traditional tomato sauce, fresh buffalo mozzarella, hand-picked basil, and extra virgin olive oil.",
    time: "15-20 dk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBygBpUWwh8OtaJC8RU2J-A3XvmOOJca3DQs7kGCsbTxO3fcb4wn7A_YykulSKHii-Y-aMMYDY2BDj27jevbX3OcLGAiQfHaJV5bnGn78U5EzoK7T-jD81IcSCQbdncrCQoJ8FagaFgoTzAsGi94d3yC7alslg07ls9QDj09SQ1AUqY2Y6owNH8TjCL_VUVJ2wPzZ1xo0cf7e8ZqdmqB_y-GLeXkZZDQ8TMB5d22qQAqqQGz-Kh9C8NXjLlbUn5oQMiZZ85v5_zA6U",
    category: "Popüler",
    tag: "%25 İndirim"
  },
  {
    id: "sweet-potato-fries",
    name: "Sweet Potato Fries",
    price: 95,
    description: "Hand-cut crispy sweet potatoes served with our signature house-made spicy aioli.",
    time: "10-15 dk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfVoyPIsfvP5OzWbIeugoMzguTP_t0xopL8iToK4Iha4cISvDsM-OkeUndsmI6ntlKuGIidFze5ztS5nWIaHNCA1IBp0vwNrpfGQ6lBSlOdCEoDGsE0-a-uoSMc4aO6NSW3rDWLeKKaBMUXu6RuISIwsZrOnnMqt1TDPbojni6ixpX_k9aRUABv6UvEbHiqg0aU9fXHsl5WWD6K3k0sA8fiNrtfnVfosqTCcMsuyRxDp2OmO4ggWBXdaz76HBNCuVLQWd5EmU41mQ",
    category: "Popüler"
  },
  {
    id: "texas-bbq-burger",
    name: "Texas BBQ Burger",
    price: 230,
    description: "Smoky BBQ sauce, double cheddar, crispy onion rings, beef bacon, and jalapeños.",
    time: "25-30 dk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-xY1ESozbcRunXRdcckHoR3xD-Ddu2NmbZnRZh1LXYHQhhg8KyuJs9kxM2kTfBbrP6THsaLo69_0NlNFJgVMB2sXjosshOXxz3uLDHpl39kNZKqIP3b1cuR-HYPqPInfMc8ZCnqM9giyt7npX_np_CUkxcJUDjR7lf6SvzNUapeb5VjkaDWR6DfXPgJub9ZdM_tTZG65G03FAyonv1ebKfQg7LBi2NUg-hta336lmD-JqkhD4OSzmtt_4QbgpD7idFt3LrQvA2n0",
    category: "Burgerler"
  },
  {
    id: "the-garden-burger",
    name: "The Garden Burger (V)",
    price: 210,
    description: "Plant-based patty, smashed avocado, alfalfa sprouts, vegan lime mayo, and red onion.",
    time: "15-20 dk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9RuVGWs0IhGclyfw7-AldgCoxhW2cJT6w6C9Ge4SfJUZ1RAks0LVDbpT6y5gSgfEG9qYrek8ikq5n9JvXZfhulf9fGlGgkyiTRFTkWP6v9J7F2xG5EqKILPqsrfGdRjAZev-Yu9soKfwXaaRdhATR3NdXHQ2Nd3WUz5zZ_XLvjCTMPryBvofAXzJZdk81Zem6g-wpRznf_eMRNTABV70PMcRhbd8IxbWPP2oqdyz3lPYQDMU2BhhCwvYjdmr4TqsWMe7ds1tfE8g",
    category: "Burgerler"
  },
  {
    id: "spicy-buffalo-chicken",
    name: "Spicy Buffalo Chicken",
    price: 195,
    description: "Crispy chicken breast, buffalo hot sauce, blue cheese crumbles, and creamy slaw.",
    time: "15-20 dk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCveDd8xl1NPHpO7PdcB_ynpQjNK3kv4zRuRY24dCM4GIuY2OmZ5oD1X43y30BSx-MobK3PV04Vqen6zecdvT7zeyyqJtngrkdTz9NEyDqAcvDOpr05t24ZMld7amUISurNtO0Zle_4I1r9t983N3I7Y-RYrCgoEEJ6Vh1Mg8vkacKnmxoBeigVsoC1IEjqhyD7bWb6WRfzoVjNzVQNTE-iN6yLcSf2nT3BPPIOYYrdncPn230rNA3h-Y4n1mVf_8_k088QIDxl1yI",
    category: "Burgerler"
  }
];

export const PREVIOUS_ORDERS = [
  {
    id: "zen-house-1",
    restaurant: "Sushi Zen House",
    date: "24 Ekim 2023 • 19:45",
    total: "650.00 TL",
    items: "4 Adet Sushi Roll, Gyoza",
    status: "Tamamlandı",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTrifkkt6jvw9cuUimITitU2E1lCwe5hjwRS8boGpu4YmTGqLqDaw7QFY7VdL2pJXrJ68JMJrRKRNC6jfAGXwLyKQOFieSgeykhCqo9Xma8aPis2LdQ25V9VilmgPTvEcRV4qXHB1UeumiOcSKn1vGOfbOwEr4dU9IKkw3dPJnrMZWPGhyEaD-oCsLDtVTNFbDJ4xP8fRnmYsfq10aJbI2Dek7N6syLVmhZVH61XUdZX5GFcvbzSrisg"
  },
  {
    id: "ali-usta-2",
    restaurant: "Kebapçı Ali Usta",
    date: "12 Ekim 2023 • 13:12",
    total: "285.50 TL",
    items: "1 Adet Adana Kebap, Künefe, Ayran",
    status: "Tamamlandı",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxM75UOJyWfklFLGzmq_RvthkdoJ62BRPSNh2KQ_u7dvZtmZuxvqoH6fGflsFnRwmFuZuzQ6V3QiB02g6iTH9e-0PJcBsIcw4WBPrVWXZTDw1G_77RReBwoZcYBafn4sjKSP9qiBFBTYvm7tN8HUcZ4AzSENAzIkJ72zHF5L3lM56VqV0QChoW7qRzFHbrXII2gdkIQOLkCQiLjPH5xgFqi4IDFG-LXXl-JevFP6puNj1hwUn3gwff8g"
  },
  {
    id: "locale-3",
    restaurant: "Pizza Locale",
    date: "01 Ekim 2023 • 21:05",
    total: "190.00 TL",
    items: "1 Adet Büyük Boy Pizza, Tiramisu",
    status: "Tamamlandı",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjL2on9vpDLbPwNdocsCUWMMvi2x1YbSe6-eGpfspDKmytErYXRF5l_NeY_KQqbHcaebo3eEN3ViwD3l8ODGzHQ4OKTVKnTboXW5n7803ItWFvhO8XG4pfmJyqeOWdIOTo-WQgt6QfKNnUmNnzEwBKanRxomVZhL2nPDgftM-ZQCb9MWZq08WJvck1MwkyL3MET6wgq82fpTrHofYU0JYH-MRf92fUWdnDQKFNKOOiv57dX6qGGEGffg"
  }
];

export const INITIAL_ACTIVE_ORDER = {
  restaurant: "Burger Xpress",
  items: "2 Adet Menü",
  total: 420.0,
  status: "Kurye yola çıktı",
  progress: 66, // progress percent
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnwB_MVSxUiwXYE8nQxNr-r1o2uxGhZBRtr03Uuw9KIAXk9sUIx3KqcmmATWOz7xP_dHgPI27PeRPZy6BKQaW0BBdxEHQfNYFTHY77m8eIksWiKmup-apWL0XdGQpKD4kjcdl_GxqEBXtf70s6SF4bnneCgZlLCoERRjVvoQNLhR7xcajFv7jtIpmfrGmTXueIg7SvTaGduuGEycSChy-kgj3YI73F1jXbbCkC2XFdJZmSPWM4gdgIhg"
};
