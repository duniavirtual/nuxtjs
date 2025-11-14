<template>
        <main class="min-h-screen">
                <div class="space-y-24">
                        <HomeIntro />

        <section class="max-w-4xl mx-auto prose dark:prose-invert">
                <ContentRenderer v-if="indexDoc" :value="indexDoc" />
                <ContentDoc v-else path="/index">
                        <template #default="{ doc }">
                                <ContentRenderer :value="doc" />
                        </template>
                        <template #not-found>
                                <div class="text-center py-8">
                                        <p class="text-gray-500">Konten tidak ditemukan. Pastikan file content/index.md ada.</p>
                                </div>
                        </template>
                </ContentDoc>
        </section>

                        
                        <HomeFeaturedArticles />
                        <HomeSocialLinks />
                        <HomeNewsletter />

                        <!-- Parental Control Service Section (mSpy Indonesia) -->
                        
                </div>
        </main>
</template>

<script setup>
const route = useRoute()
const siteUrl = useSiteUrl()

const { data: indexDoc } = await useAsyncData('index-doc', async () => {
        let doc = await queryContent().where({ slug: '/index' }).findOne().catch(() => null)
        if (doc) return doc

        doc = await queryContent('/index').findOne().catch(() => null)
        if (doc) return doc

        doc = await queryContent().where({ _path: '/index' }).findOne().catch(() => null)
        if (doc) return doc

        doc = await queryContent('index').findOne().catch(() => null)
        return doc || null
})

const fallbackImage = '/default.png';
const currentUrl = computed(() => siteUrl.value + route.path);

const metaTitle = computed(() => indexDoc.value?.title);
const metaDescription = computed(() => indexDoc.value?.description);
const metaImage = computed(() => {
  const image = indexDoc.value?.image || indexDoc.value?.thumbnail || fallbackImage;
  return image?.startsWith('http') ? image : `${siteUrl.value}${image}`;
});

useSeoMeta({
  title: () => metaTitle.value,
  description: () => metaDescription.value,
  ogTitle: () => metaTitle.value,
  ogDescription: () => metaDescription.value,
  ogUrl: () => currentUrl.value,
  ogImage: () => metaImage.value,
  ogImageAlt: () => metaTitle.value,
  ogType: 'website',
  ogSiteName: 'penyadap.pages.dev',
  twitterCard: 'summary_large_image',
  twitterTitle: () => metaTitle.value,
  twitterDescription: () => metaDescription.value,
  twitterImage: () => metaImage.value
})

useHead(() => ({
  link: [
    { rel: 'canonical', href: currentUrl.value }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${siteUrl.value}/#organization`,
            name: 'penyadap.pages.dev',
            url: siteUrl.value,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl.value}/logo.png`
            },
            description: 'Jasa Pemasangan Parental Control — mSpy (Indonesia)'
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl.value}/#website`,
            url: siteUrl.value,
            name: 'penyadap.pages.dev',
            description: 'Jasa Pemasangan Parental Control — mSpy (Indonesia)',
            publisher: {
              '@id': `${siteUrl.value}/#organization`
            },
            inLanguage: 'id-ID'
          },
          {
            '@type': 'WebPage',
            '@id': `${currentUrl.value}/#webpage`,
            url: currentUrl.value,
            name: metaTitle.value || 'Aplikasi Sadap iPhone & Android',
            description: metaDescription.value || 'Jasa Pemasangan Parental Control — mSpy (Indonesia)',
            isPartOf: {
              '@id': `${siteUrl.value}/#website`
            },
            about: {
              '@id': `${siteUrl.value}/#organization`
            },
            inLanguage: 'id-ID',
            primaryImageOfPage: {
              '@type': 'ImageObject',
              url: metaImage.value
            }
          }
        ]
      })
    }
  ]
}))
</script>
