"""Render conceptual UAV controller mounts with Blender 4.5 LTS.

Run: blender -b -t 6 --python docs/asset-sources/uav_mounts.py -- /path/to/output
Scene units are illustrative. The parts are based on the portfolio schematic.
"""
import sys
from math import cos, pi, sin
from pathlib import Path

import bpy
from mathutils import Vector

output = Path(sys.argv[sys.argv.index("--") + 1]).resolve()
output.mkdir(parents=True, exist_ok=True)


def material(name, color, roughness, metallic=0):
    result = bpy.data.materials.new(name)
    result.diffuse_color = (*color, 1)
    result.use_nodes = True
    shader = result.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    return result


def finish(obj, name, surface, bevel=0):
    obj.name = name
    obj.data.materials.append(surface)
    if bevel:
        modifier = obj.modifiers.new("Machined edge", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
        add_weighted_normals(obj)
    return obj


def add_weighted_normals(obj):
    normals = obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    normals.keep_sharp = True


def box(name, dimensions, location, surface, bevel=0.03):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, surface, bevel)


def rod(name, start, end, radius, surface, bevel=0.014, sides=32):
    axis = Vector(end) - Vector(start)
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=sides, radius=radius, depth=axis.length, location=Vector(start) + axis * 0.5
    )
    obj = bpy.context.object
    obj.rotation_euler = axis.to_track_quat("Z", "Y").to_euler()
    for polygon in obj.data.polygons:
        polygon.use_smooth = abs(polygon.normal.z) < 0.5
    return finish(obj, name, surface, bevel)


def pin(name, x, y, bottom, top, radius, surface):
    return rod(name, (x, y, bottom), (x, y, top), radius, surface)


def screw(x, y, height, steel, recess):
    pin("Socket screw", x, y, height, height + 0.06, 0.073, steel)
    rod("Hex socket", (x, y, height + 0.059), (x, y, height + 0.063), 0.034, recess, 0, 6)


def plate(name, size, z, surface, holes):
    width, depth, thickness = size
    base = box(name, size, (0, 0, z), surface, 0)
    for x, y, radius in holes:
        bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=radius, depth=thickness + 0.6, location=(x, y, z))
        cutter = bpy.context.object
        bpy.context.view_layer.objects.active = base
        cut = base.modifiers.new("Through hole", "BOOLEAN")
        cut.object = cutter
        bpy.ops.object.modifier_apply(modifier=cut.name)
        bpy.data.objects.remove(cutter, do_unlink=True)
    bevel = base.modifiers.new("Plate edge radius", "BEVEL")
    bevel.width = 0.045
    bevel.segments = 3
    add_weighted_normals(base)
    return base


def rubber_mount(x, y, rubber):
    # One lathed surface keeps the waist and the two shoulders continuous.
    profile = [(0.25, 0.178), (0.29, 0.196), (0.39, 0.186), (0.49, 0.145),
               (0.62, 0.141), (0.74, 0.171), (0.83, 0.196), (0.88, 0.173)]
    sides = 48
    points = [(x + radius * cos(2*pi*i/sides), y + radius * sin(2*pi*i/sides), z)
              for z, radius in profile for i in range(sides)]
    faces = [tuple(reversed(range(sides)))]
    for start in range(0, sides * (len(profile) - 1), sides):
        faces.extend((start+i, start+(i+1)%sides, start+sides+(i+1)%sides, start+sides+i)
                     for i in range(sides))
    faces.append(tuple(range(len(points) - sides, len(points))))
    mesh = bpy.data.meshes.new("Elastomer profile")
    mesh.from_pydata(points, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("Elastomer isolator", mesh)
    bpy.context.collection.objects.link(obj)
    for polygon in mesh.polygons:
        polygon.use_smooth = len(polygon.vertices) == 4
    finish(obj, "Elastomer isolator", rubber)


def controller(z, shell, pcb, steel, recess, label):
    box("Controller PCB", (1.80, 1.30, 0.075), (0, 0, z + 0.05), pcb, 0.035)
    box("Controller enclosure", (1.78, 1.27, 0.29), (0, 0, z + 0.23), shell, 0.105)
    box("ID plate", (0.58, 0.48, 0.018), (-0.15, 0.035, z + 0.382), steel)
    bpy.ops.object.text_add(location=(-0.15, 0.045, z + 0.394))
    mark = bpy.context.object
    mark.name = "Flight controller label"
    mark.data.body = "FC"
    mark.data.align_x = "CENTER"
    mark.data.align_y = "CENTER"
    mark.data.size = 0.24
    mark.data.materials.append(label)
    for n in range(4):
        box("Connector housing", (0.24, 0.18, 0.13), (-0.58 + n*0.36, -0.642, z + 0.141), steel)
        box("Connector socket", (0.17, 0.028, 0.073), (-0.58 + n*0.36, -0.733, z + 0.145), recess, 0.01)
    for y in (-0.31, -0.18, -0.05, 0.08, 0.21, 0.34):
        box("Enclosure rib", (0.27, 0.035, 0.028), (0.50, y, z + 0.373), shell, 0.013)


def scene_for(concept, close_view=False):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 28
    scene.cycles.use_denoising = True
    scene.view_settings.view_transform = "AgX"
    scene.render.resolution_x, scene.render.resolution_y = (1440, 900) if close_view else (840, 620)
    scene.render.image_settings.file_format = "PNG"
    scene.render.resolution_percentage = 100

    shell = material("Blue-gray anodized housing", (0.045, 0.092, 0.125), 0.35, 0.40)
    airframe = material("Graphite airframe plate", (0.065, 0.083, 0.104), 0.46, 0.32)
    tray = material("Machined aluminum carrier", (0.27, 0.33, 0.38), 0.35, 0.67)
    steel = material("Satin fasteners", (0.52, 0.58, 0.62), 0.28, 0.72)
    recess = material("Socket interiors", (0.012, 0.017, 0.024), 0.54)
    pcb = material("PCB solder mask", (0.027, 0.24, 0.19), 0.50)
    rubber = material("Teal elastomer", (0.015, 0.34, 0.24), 0.43)
    tether = material("Indigo suspension links", (0.19, 0.12, 0.40), 0.42)
    label = material("Ink", (0.033, 0.071, 0.095), 0.48)

    base_holes = [(x, y, 0.145) for x in (-1.71, 1.71) for y in (-0.90, 0.90)]
    base_holes.extend((x, y, 0.072) for x in (-1.31, 1.31) for y in (-0.93, 0.93))
    plate("Airframe mounting area", (3.85, 2.40, 0.20), 0.13, airframe, base_holes)
    z = 0.96
    box("Controller carrier", (2.75, 1.77, 0.14), (0, 0, z), tray, 0.07)
    controller(z + 0.07, shell, pcb, steel, recess, label)

    for x in (-1.08, 1.08):
        for y in (-0.63, 0.63):
            if concept == "elastomer":
                pin("Lower isolator washer", x, y, 0.23, 0.28, 0.209, steel)
                rubber_mount(x, y, rubber)
                pin("Upper isolator washer", x, y, 0.86, z-0.065, 0.209, steel)
            elif concept == "rigid":
                pin("Flanged foot", x, y, 0.23, 0.32, 0.155, steel)
                rod("Rigid metal standoff", (x, y, 0.28), (x, y, z-0.06), 0.106, steel, sides=6)
            else:
                upright = x * 1.47
                box("Suspension upright", (0.14, 0.13, 1.43), (upright, y, 0.945), tray)
                pin("Hanger anchor", upright, y, 1.50, 1.65, 0.102, steel)
                rod("Angled suspension link", (upright, y, 1.54), (x, y, z+0.08), 0.055, tether)
            screw(x, y, z+0.069, steel, recess)
        if concept == "suspended":
            box("Suspension crossbar", (0.15, 1.59, 0.13), (x*1.47, 0, 1.62), tray)

    floor = material("Matte studio surface", (0.68, 0.74, 0.77), 0.74)
    box("Studio floor", (200, 200, 0.2), (0, 0, -0.1), floor, 0)
    world = bpy.data.worlds.new("Studio")
    world.use_nodes = True
    scene.world = world
    world.node_tree.nodes.get("Background").inputs[0].default_value = (0.68, 0.75, 0.85, 1)
    world.node_tree.nodes.get("Background").inputs[1].default_value = 0.34
    for name, position, power, size in [
        ("Softbox", (-3.8, -4.8, 7.5), 720, 5.0),
        ("Fill", (4.5, -2, 3.5), 285, 4.0),
        ("Rim", (2.3, 4.5, 5.1), 570, 3.6),
    ]:
        light = bpy.data.lights.new(name, "AREA")
        light.energy, light.shape, light.size = power, "DISK", size
        obj = bpy.data.objects.new(name, light)
        scene.collection.objects.link(obj)
        obj.location = position
        obj.rotation_euler = (Vector((0, 0, 0.45)) - obj.location).to_track_quat("-Z", "Y").to_euler()
    bpy.ops.object.camera_add(location=(5.8, -7.7, 4.9) if close_view else (5.8, -8.0, 6.2))
    camera = bpy.context.object
    camera.rotation_euler = (Vector((0, 0, 0.66)) - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 5.30 if close_view else 5.50
    scene.camera = camera
    return scene


for concept, close_view in (("elastomer", True), ("rigid", False), ("elastomer", False), ("suspended", False)):
    scene = scene_for(concept, close_view)
    name = "hero" if close_view else concept
    scene.render.filepath = str(output / f"{name}.png")
    bpy.ops.render.render(write_still=True)
