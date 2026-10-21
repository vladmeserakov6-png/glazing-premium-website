# Изменения к ревью — этап 1

## Предлагаемый заголовок PR

`Создать Next.js-проект и премиальную адаптивную главную страницу`

## Описание

Вместо репозитория с одним README реализована основа сайта остекления на Next.js App Router, React, TypeScript и Tailwind CSS. Добавлены дизайн-система, русскоязычная адаптивная главная, каталог восьми услуг с фильтрами и подробностями, доступные диалоги, FAQ и локальная подготовка задания на расчет.

CTA скачивает текстовый файл и не имитирует принятую заявку. Цены, контакты, отзывы, гарантии и результаты компании не выдуманы. «ПРОСВЕТ» — временное название концепции; изображения — локальные AI-референсы, а не портфолио. До согласования данных и домена индексация закрыта.

## Проверки в текущей облачной среде

Node.js 24.19.0, npm 11.9.0, Next.js 16.4.2, React 19.3.1. Все результаты ниже относятся к текущей версии кода и production-сборке в этой среде.

| Проверка | Результат |
| --- | --- |
| `npm ci --no-audit` | Успешная повторная установка по lockfile |
| `npm run typecheck` | Успешно, TypeScript strict |
| `npm run lint` | Успешно, 0 ошибок и предупреждений |
| `npm run build` | Успешно, главная статически пререндерена |
| `npm run test:e2e` | 18 из 18, 0 пропусков; Chromium desktop и mobile |
| axe WCAG 2 / 2.1 / 2.2 AA | 0 обнаруженных нарушений на главной и в форме в обоих профилях |
| `npm audit --omit=dev --audit-level=high` | 0 известных уязвимостей production-зависимостей |
| `git diff --check` | Успешно |
| `npm run dev` и HTTP-проверка | Успешно: главная и оптимизированное изображение доступны |

Браузерные проверки включают фильтры и раскрытие всех услуг, корректный выбор услуги в форме, валидацию размеров, проверку скачанного текста, отсутствие POST-запросов при подготовке задания, FAQ с клавиатуры, мобильное меню, удержание и возврат фокуса, Escape, якоря, отсутствие горизонтального скролла при ширине 320/390/768/1024/1440 CSS px, изображения и 404.

Скриншоты для визуального ревью находятся в `docs/previews/`: desktop 1440 px, mobile 390 px. Они показывают текущую концепцию, а не опубликованный сайт.

ESLint закреплен на совместимой с `eslint-config-next` и его плагинами ветке 9. npm предупреждает об окончании ее поддержки; ESLint 10 пока конфликтует с peer-диапазонами `eslint-plugin-import`, `eslint-plugin-react` и `eslint-plugin-jsx-a11y` в текущем Next-конфиге. Переход на 10 следует выполнить после обновления совместимых плагинов. Установка не использует `--force` / `--legacy-peer-deps`.

## Проверить при ревью

- [ ] Утвердить дизайн и название либо заменить бренд данными заказчика.
- [ ] Проверить desktop и мобильную версию, тексты и порядок услуг.
- [ ] Подтвердить границу этапа: диалоги вместо отдельных страниц, файл задания вместо доставки заявки.
- [ ] Согласовать следующие приоритетные страницы и запросить данные из `PROJECT_PLAN.md`.
- [ ] Запустить GitHub Actions после создания PR. Workflow подготовлен; выполнение в GitHub в этой итерации не проверялось.

## Что еще не проверено / не реализовано

Реальные Safari и Firefox, скринридер и физические устройства не проверялись. Lighthouse и Core Web Vitals не измерялись; баллы 90+ не заявляются. Отдельные страницы услуг, калькулятор, серверные заявки, CRM, юридические страницы, production SEO и публикация относятся к следующим этапам.

Изменения предназначены для отдельной ветки и последующего PR. Слияние в `main` и публикация сайта относятся к следующему шагу. Сохранение облачной среды Codex само по себе не создает публичную ссылку на сайт.

Для повторного использования облачной среды сохранены поля `install_script` (`npm ci`) и `start_skill` (запуск, проверка готовности, команды проверок и ограничения первого этапа). Это черновик настроек: сохранение не публикует среду и сайт. Для активации следует проверить и сохранить настройки среды, затем опубликовать среду через интерфейс продукта.

## Файлы

Список основных файлов и компонентов:

```text
.github/workflows/ci.yml
.gitignore
.npmrc
.nvmrc
AGENTS.md (создан Next.js при проверке dev-сервера)
package.json
package-lock.json
tsconfig.json
next-env.d.ts
next.config.ts
postcss.config.mjs
eslint.config.mjs
playwright.config.ts
README.md (обновлен)
PROJECT_PLAN.md
docs/ASSETS.md
docs/DESIGN_SYSTEM.md
docs/REVIEW.md
docs/previews/home-desktop.png
docs/previews/home-mobile.png
public/images/architecture.webp
public/images/interior.webp
public/images/balcony.webp
public/images/terrace.webp
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/icon.svg
src/app/not-found.tsx
src/app/robots.ts
src/components/layout/logo.tsx
src/components/layout/header.tsx
src/components/layout/footer.tsx
src/components/home/hero.tsx
src/components/home/benefits.tsx
src/components/home/services.tsx
src/components/home/approach.tsx
src/components/home/inspiration.tsx
src/components/home/faq.tsx
src/components/home/project-cta.tsx
src/components/project/project-provider.tsx
src/components/project/project-brief-form.tsx
src/components/ui/button.tsx
src/components/ui/section-heading.tsx
src/components/ui/modal.tsx
src/components/ui/reveal.tsx
src/content/site.ts
src/lib/project-brief.ts
tests/e2e/home.spec.ts
```
