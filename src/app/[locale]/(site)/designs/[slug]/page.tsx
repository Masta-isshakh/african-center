import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { projectMetadata, imageGalleryJsonLd, localizedUrl } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import { adjacentProjects, projectBySlug, projectSlugs, toGalleryImages } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CtaBand } from '@/components/ui/CtaBand';
import { Divider } from '@/components/ui/Divider';
import { JsonLd } from '@/components/ui/JsonLd';
import { ProjectHero } from '@/components/portfolio/ProjectHero';
import { ProjectOverview } from '@/components/portfolio/ProjectOverview';
import { ProjectGallery } from '@/components/portfolio/ProjectGallery';
import { ProjectVideo } from '@/components/portfolio/ProjectVideo';
import { ProjectNav } from '@/components/portfolio/ProjectNav';

type Params = { params: { locale: Locale; slug: string } };

/** Every project is known at build time; anything else is a real 404 instead of a streamed not-found with status 200. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Params) {
  const project = projectBySlug(slug);
  return project ? projectMetadata(locale, project) : {};
}

export default async function ProjectPage({ params: { locale, slug } }: Params) {
  setRequestLocale(locale);
  const project = projectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: 'portfolio' });
  const td = await getTranslations({ locale, namespace: 'designs' });
  const gallery = toGalleryImages(project.images, locale);
  const { prev, next } = adjacentProjects(slug);
  const title = project.title[locale];

  return (
    <>
      <ProjectHero project={project} locale={locale} />
      <Divider from="charcoal" to="sand" shape="curve" />
      <ProjectOverview project={project} locale={locale} />

      <Section id="gallery" tone="white" labelledBy="gallery-title">
        <div className="container-site">
          <SectionHeading id="gallery-title" eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} />
          <div className="mt-10">
            <ProjectGallery items={gallery} project={slug} />
          </div>
        </div>
      </Section>

      {project.video && (
        <>
          <Divider from="white" to="charcoal" />
          <Section tone="dark" labelledBy="video-title">
            <div className="container-site grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <SectionHeading id="video-title" dark eyebrow={t('video.eyebrow')} title={t('video.title')} lead={t('video.lead')} />
              </div>
              <div className="lg:col-span-8">
                <ProjectVideo
                  project={slug}
                  title={title}
                  sources={project.video.sources}
                  poster={toGalleryImages([project.video.poster], locale)[0]}
                  duration={project.video.duration}
                />
              </div>
            </div>
          </Section>
          <Divider from="charcoal" to="sand" shape="curve" />
        </>
      )}

      <section className="bg-sand pt-16 sm:pt-20">
        <div className="container-site">
          <ProjectNav prev={prev} next={next} locale={locale} />
        </div>
      </section>

      <CtaBand title={t('cta.title')} body={t('cta.body')} cta={td('requestSimilar')} href="/start" trackProps={{ placement: 'project_page', project: slug }} />

      <JsonLd
        data={imageGalleryJsonLd({
          name: title,
          description: project.excerpt[locale],
          url: localizedUrl(locale, `/designs/${slug}`),
          images: project.images.map((i) => ({ url: `${siteUrl}${i.src}`, caption: i.caption[locale], width: i.width, height: i.height })),
        })}
      />
    </>
  );
}
