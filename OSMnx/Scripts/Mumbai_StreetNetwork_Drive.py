import osmnx as ox
a = ox.graph_from_place('Mumbai, India',network_type= "drive")
ox.save_graph_shapefile(a, filepath="F:/Programming/osmnx/shapefiles/Mumbai_street_drive", encoding="utf-8")
