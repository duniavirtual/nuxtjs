export const useSiteUrl = () => {
  const siteConfig = useSiteConfig()
  const runtimeConfig = useRuntimeConfig()
  
  return computed(() => 
    siteConfig.value?.url || 
    runtimeConfig.public?.siteUrl || 
    'https://penyadap.pages.dev'
  )
}
