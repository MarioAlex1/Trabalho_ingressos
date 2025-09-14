<template>
    <div class="min-h-screen flex flex-col md:flex-row justify-center items-start gap-8">
        <div :class="[
            'max-w-2xl p-6 rounded-lg mt-4 shadow-md transition-colors',
            dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        ]">
            <h2 class="text-2xl font-bold mb-4">Bem-vindo ao Eclipse</h2>
            <p class="mb-4">
                Descubra eventos incríveis e compre seus ingressos com facilidade.
            </p>
            <button
                class="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
                Explore Eventos
            </button>
        </div>

        <div :class="[
            'max-w-2xl p-6 rounded-lg mt-4 shadow-md transition-colors',
            dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        ]">
            <h2 class="text-2xl font-bold mb-4">O que é o Eclipse?</h2>
            <p class="mb-4">O Eclipse é um site de vendas de ingressos voltado para eventos na cidade de Boa Viagem.
                A plataforma facilita o acesso do público a shows, festas, palestras e outras atrações locais,
                reunindo tudo em um só lugar.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomeCard",
    props: {
        dark: {
            type: Boolean,
            default: false
        }
    }
};
</script>