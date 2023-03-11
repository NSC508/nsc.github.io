from manim import *
import numpy as np
import pandas as pd
data = pd.read_csv('/workspaces/nsc508.github.io/TXTDS_404/data.csv')
#set neighbor_caste equal to the column of the dataframe Q63g which have values 1, 2, 3, or 4
data = data['QCASTE'].replace([2, 3, 4, 97], [8, 24, 81, 100]).mask(data['QCASTE'] == 1, data['QCASTEb'])
print(data)
neighbor_caste = data.loc[(data == '1') | (data == '2')| (data == 8)| (data == 24)| (data == 81)| (data == '97')]
print(neighbor_caste)
#get the percentage of each caste
neighbor_caste = neighbor_caste.value_counts(normalize=True)
colors = [RED, BLUE, GREEN, YELLOW, PURPLE, GOLD]
map_caste_num_to_name = {'1': "Brahmin", '2': "Forward Caste", 8: "Scheduled Caste", 24: "Scheduled Tribe", 81: "Backward Class", '97': "None"}

class CasteCircles(Scene):
    def construct(self):
        num_circles = 100
        circles = [Circle() for _ in range(num_circles)] # create 100 circles
        caste_percentages = neighbor_caste * num_circles # get the percentage of each caste
        caste_percentages = list(caste_percentages)
        print(list(caste_percentages))
        #make the circles smaller
        for circle in circles:
            circle.scale(0.3)
        
        #color the circles according to the percentage of each caste
        for i, circle in enumerate(circles):
            if i < caste_percentages[0]:
                circle.set_color(colors[0])
            elif i < caste_percentages[0] + caste_percentages[1]:
                circle.set_color(colors[1])
            elif i < caste_percentages[0] + caste_percentages[1] + caste_percentages[2]:
                circle.set_color(colors[2])
            elif i < caste_percentages[0] + caste_percentages[1] + caste_percentages[2] + caste_percentages[3]:
                circle.set_color(colors[3])
            elif i < caste_percentages[0] + caste_percentages[1] + caste_percentages[2] + caste_percentages[3] + caste_percentages[4]:
                circle.set_color(colors[4])
            else:
                circle.set_color(colors[5])

        #arrange them in a grid
        circles_group = VGroup(*circles).arrange_in_grid(buff=0.1, n_rows=5)
        self.add(circles_group) # add them to the scene
        circles_group.shift(3*LEFT)

        # animate them all
        self.play(
            *[GrowFromCenter(circle) for circle in circles_group]
        ) 
        
        #add a legend to the side. Make the text much smaller
        legend = VGroup()
        for i, caste in enumerate(neighbor_caste.index):
            legend.add(Dot(color=colors[i]))
            legend.add(Text(map_caste_num_to_name[caste], color=colors[i]))
        legend.arrange_in_grid(rows = len(caste_percentages))
        legend.shift(4*RIGHT)
        legend.scale(0.5)
        self.add(legend)


        #animate the legend
        self.play(
            *[GrowFromCenter(circle) for circle in legend]
        )
