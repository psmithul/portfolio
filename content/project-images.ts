import type { Project } from '@/content/projects';

export const projectImages: Record<string, NonNullable<Project['image']>> = {
  'uav-vibration-integration': {
    kind: 'reference',
    src: '/images/projects/photos/uav-vibration-integration.webp',
    width: 1800,
    height: 914,
    alt: 'A photographic macro view of the front and back of a Naze32 multicopter flight-controller board.',
    caption:
      'Reference photograph · Naze32 flight controller. Lucasbosch / Wikimedia Commons.',
    fit: 'cover',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:AbuseMark_AfroFlight_Naze_32_Flight_Controller_rev5_white.jpg',
    referenceLabel: 'Photo source',
  },
  'adaptive-suspension-rover': {
    kind: 'reference',
    src: '/images/projects/photos/adaptive-suspension-rover.webp',
    width: 1800,
    height: 1200,
    alt: 'NASA/JPL-Caltech Scarecrow six-wheel rover during a desert mobility test.',
    caption: 'Reference photograph · NASA/JPL-Caltech Scarecrow rover.',
    fit: 'cover',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:Curiosity-rover-stunt-double-scarecrow-dumont-dunes-br2.jpg',
    referenceLabel: 'Photo source',
  },
  'tensegrity-joint': {
    kind: 'documentation',
    src: '/images/projects/tensegrity-joint-cad.webp',
    width: 1200,
    height: 1200,
    alt: 'Native CAD view of the tensegrity joint study, showing links, pivots, tension cables, and springs.',
    caption:
      'Joint CAD study · Paper-based mechanism reconstruction; not tested hardware.',
    fit: 'cover',
    referenceUrl: 'https://arxiv.org/abs/2504.19685',
    referenceLabel: 'Reference paper',
  },
  kneeassist: {
    kind: 'documentation',
    src: '/images/projects/knee-assistance-cad.png',
    width: 1718,
    height: 1268,
    alt: 'CAD of the actuated knee assistance system, with adjustable rails, cuffs, knee pivot, motor, spring, and cable drive.',
    caption:
      'Actuated knee assistance system · Original CAD screenshot supplied by Mithul.',
    fit: 'cover',
  },
  'reaction-wheel-microvibrations': {
    kind: 'documentation',
    src: '/images/projects/reaction-wheel-reference-cad.webp',
    width: 1500,
    height: 1125,
    alt: 'A sectioned reaction-wheel housing inside the project’s engineering reference satellite assembly.',
    caption:
      'Project reference CAD · Verified assembly; surface finishes are illustrative.',
    fit: 'cover',
  },
  'off-road-leaf-robot': {
    kind: 'reference',
    src: '/images/projects/photos/off-road-leaf-robot.webp',
    width: 1800,
    height: 1201,
    alt: 'Fallen leaves covering a forest floor.',
    caption: 'Reference photograph · Leaf litter. Yinan Chen / public domain.',
    fit: 'cover',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:Gfp-leafy-autumn-forest-floor.jpg',
    referenceLabel: 'Photo source',
    licenseUrl:
      'https://web.archive.org/web/20230926203737/https://creativecommons.org/licenses/publicdomain/',
  },
  'uncertainty-aware-navigation': {
    kind: 'reference',
    src: '/images/projects/photos/uncertainty-aware-navigation.webp',
    width: 1319,
    height: 1800,
    alt: 'A photographed TurtleBot3 Burger mobile robot with wheels, sensing and control electronics.',
    caption:
      'Reference photograph · TurtleBot3 mobile robot. Kuscu0 / CC BY-SA 4.0.',
    fit: 'contain',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:TurtleBot3_Burger.jpg',
    referenceLabel: 'Photo source',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'four-bar-door-mechanism': {
    kind: 'reference',
    src: '/images/projects/photos/four-bar-door-mechanism.webp',
    width: 1800,
    height: 1200,
    alt: 'A physical Bennett four-bar rotational linkage photographed against a neutral background.',
    caption:
      'Reference photograph · Bennett four-bar linkage. Twdragon / CC BY-SA 3.0.',
    fit: 'cover',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:Bennett_four-bar_linkage.jpg',
    referenceLabel: 'Photo source',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  'easy-access-wallet': {
    kind: 'reference',
    src: '/images/projects/photos/easy-access-wallet.webp',
    width: 1800,
    height: 1350,
    alt: 'A ZNAP slim card holder with cards and its removable coin compartment visible.',
    caption:
      'Reference photograph · ZNAP card holder. kartenetui.info / CC BY 4.0.',
    fit: 'cover',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:ZNAP_Kreditkartenetui_mit_Geldklammer_und_M%C3%BCnzfach_(Slimpuro)_01.jpg',
    referenceLabel: 'Photo source',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  'solar-smart-home': {
    kind: 'reference',
    src: '/images/projects/photos/solar-smart-home.webp',
    width: 1280,
    height: 826,
    alt: 'An Arduino Uno connected to a breadboard with jumper wires and a push button.',
    caption:
      'Reference photograph · Arduino circuit. Shuiwiiki / CC BY-SA 4.0.',
    fit: 'cover',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:Breadboard_example_by_shuiwiki.jpg',
    referenceLabel: 'Photo source',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'traffic-and-elevated-bus': {
    kind: 'reference',
    src: '/images/projects/photos/traffic-and-elevated-bus.webp',
    width: 951,
    height: 1500,
    alt: 'A real three-aspect LED traffic signal in Forest Hill, New South Wales.',
    caption: 'Reference photograph · LED traffic signal. Bidgee / CC BY 3.0.',
    fit: 'contain',
    referenceUrl:
      'https://commons.wikimedia.org/wiki/File:LED_traffic_light.jpg',
    referenceLabel: 'Photo source',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
};
