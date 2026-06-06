import { PrismaService } from './prisma.service';

const prisma = new PrismaService();

const DEPARTMENTS = [
  {
    name: 'Obras Públicas',
    slug: 'obras-publicas',
    description:
      'Construcción, mantenimiento de vías, infraestructura urbana, habilitaciones urbanas.',
  },
  {
    name: 'Licencias y Comercio',
    slug: 'licencias-comercio',
    description:
      'Licencias de funcionamiento, autorizaciones comerciales, inspecciones de establecimientos.',
  },
  {
    name: 'Desarrollo Social',
    slug: 'desarrollo-social',
    description:
      'Programas sociales, apoyo a poblaciones vulnerables, DEMUNA, adulto mayor.',
  },
  {
    name: 'Rentas y Tributación',
    slug: 'rentas-tributacion',
    description:
      'Impuesto predial, arbitrios, deudas tributarias, fraccionamientos de pago.',
  },
  {
    name: 'Registro Civil',
    slug: 'registro-civil',
    description:
      'Partidas de nacimiento, matrimonio, defunción, rectificaciones de datos.',
  },
  {
    name: 'Medio Ambiente',
    slug: 'medio-ambiente',
    description:
      'Áreas verdes, residuos sólidos, contaminación ambiental, ruidos molestos.',
  },
  {
    name: 'Seguridad Ciudadana',
    slug: 'seguridad-ciudadana',
    description:
      'Serenazgo, denuncias de inseguridad, apoyo policial, vigilancia vecinal.',
  },
  {
    name: 'Secretaría General',
    slug: 'secretaria-general',
    description:
      'Trámites no clasificados, mesa de partes, documentos sin área definida.',
  },
];

async function main() {
  console.log('Seeding departments...');

  for (const dept of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: dept,
    });
  }

  console.log(`${DEPARTMENTS.length} departments seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
