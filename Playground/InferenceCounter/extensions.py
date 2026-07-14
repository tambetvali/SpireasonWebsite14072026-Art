# ============================================================================================================
# ============================================================================================================
# 0.0                                                                                             INTRODUCTION
# ============================================================================================================

# ============================================================================================================
# 1.0                                                                                   BACKGROUND INFORMATION
# ============================================================================================================

# I decided that initial version of number system JSON is basically the complete one, coming from me.
# - You are free to extend it: remove unneeded constraints, which take place, or have a simple file with one
#   number list with spaces; and you can add things. Feel free to convert it to SQLite, MongoDB or other
#   database format and modify.
# - On my side, I do not want to break this, or even to make it complicated.
#
#   The source numbers.json is enough for this:
#   - Represents Laegna number system
#   - Gives comparable decimal indices
#   - Orders numbers in given R systems, and has a default order R[1, 2, 3, 4]: R, ordered by it's
#     values 1, 2, 3, 4; constructor property of a "Rib" class.
#   - Coordinate dispositioning always maps to discrete system.

# In basic Laegna number systems represented as discrete counters, I do not represent floating point or
# fraction numbers without taking care:
# - Percentage calculation was removed.
# - Floating point numbers are not given.
# - Octavian numbers do not have their actual implementation in log and exp, but carefully linearize this.
#
# > In this system: certain mathematical non-linear characteristics are removed by using discrete digits;
# > follows my infinity theorem of discrete digits and bounded systems.

# The basic quality criteria, thus, was not to add additional parameters to numbers.json, but to have
#   complete-enough file to analyze each number about basic properties and calculate any extended criteria.
#
# This, here, is an extension file.
#
# It will add new information about our chosen numbers, using the string format representations in json and
# analysing them based on number analysis and digit analysis, or linear calculations.

# decoder.py simply echoes numbers.json to screen: it could be easily extended to save this file, but the file
# itself was not meant to be changed every day, or to change it's date.
#
# This script is different: it reads numbers.json, which was confirmed manually and remains the etalon; one
# file whose structure is not messed up: for example, changing uninteresting pieces of code with an AI, you might
# not care about local error; but if whole your numbering breaks, multiple components may break down.

# Universe:
#
# - Last point of the quality criteria.
#
#   R=1 represents 1'st octave; R=4 then contains absolute symmetry to infinities, zeroes and number system; you can assume the local number continues in fractals in each dimension;
#   and if you extend the number to unknown positions, those digits remain the defaults - if it's not so, the number is not completely equal to itself, but "posetive" space remains
#   for it to fix itself, and negotive is the consequence it has to matter. Reality criterias might change.
#
#   Ideally, very often you do it more like *vice versa*: use octave R=4, the first octave (R goes octave-symmetrically through 0, 1, 2, 4, 5; each time it's the frequential range
#   and seems as linear system in integral-differential orders, octave operations and lightwave inference; as well the numbers can be comparatively operated and influentially,
#   automated); you use R=1 to show the metathesis, and between this one-unit value, and actually a quadratic function which could pass two octaves, but then after one "X" in some
#   notations of Laegna; the quadratic display takes same thing you can measure with one number, into simples possible matrix which still behaves like a number. Altough it's still
#   four digits in their complex interaction through +, -, *, / and in laegna we have additional · and : for U and ∩, meaning we do not know exactly the sign of the operation in it's
#   own area; but averaged to simple average if you remove the statistical table and replace with symmetric equivalent number in closes approximation of numbers and their range,
#   so that you have that number space to express. This is the latin-based way to write 6 operations of Laegna.
#
#   Notice the number fractal: that you are repeating it through dimensions, simply follows the fact that interferencially, you are introducing additional inferences if you include
#   more properties into number hologram, subsequently it's the new number system where the number proved to be wrong - if it's 25% growth, it's won't turn suddenly into 12.5% just
#   beneath your horizon, but you somehow scope it and with ·, :, and extremes (U, V, W, ∩ - the same upside down U you see in 3D animation properly, but here using similar shape
#   of math symbol; we cannot just use "V" in context of three or four U's if we use them as generic boundaries for all numbers).

# The simple, last point: the physics simulation, necessarily, does not overload the number jason file which already puts all numbers into perspective of Laegna, Laegna phased complex
# ("waveweaver", like Luke Skywalker, as a nickname in code which surprisingly passed into it's manual by CoPilot); so the datus which converts it to lightwave inference, is added here.

# Over all, you can regenerate numbers.json for your needs:
# - Use decoder.py with your own list of R values, which create chapters for arbitrary lengths of numbers. It's a closed box system, necessary quality to verify early number experiments
#   in controlled conditions: if you intent to produce random numbers into random lists, you have to change the code in way that it's not so easy to reflect; and it's rather optimized
#   system than etalon: the latter must be like w3c browser - the HTML is absolutely correct, but with all complexities removed even the screen lags are just in random positions, not
#   covered with cinematic effects to move your attention to what is not flickering, and display it: instead, while it's rapidly fast, for example the scroll is just jumping with
#   your mouse. A bit, I need to keep this quality here: altough I do not think the 3D version was suffering from this; rather, the list is very carefully contained and arbitrary
#   quality now built on top of it.
#
#   > So we implement arbitrary qualities as extensions, such as mappings to floats and wavelength effects; sheepcounter.json gives you a list of animation frames and debugging info;
#   > we want this in final json, because who wants to invent timing when creating simplest animation of passing numbers: even if they march, you can add your own special effects on
#   > this linear timeline, but the scripts are enough to give you arbitrary dimensions you need for timeline, chapter, frame etc. control.
#
#   So for example, you can create simple graphics in python, load the json file, multiply timeline coordinates by five but not think how to order and what to order in this mess,
#   or in which order the chars even are: here, rather we create a version where these are added as extensions separately, and you can comment out certain lines. Still the quality
#   criteria is, that this happens in separate script and even this one will be quite frozen if finished: the information added is very generic, such as the central floating point
#   formats but not derivations.

# ============================================================================================================
# 2.0                                                                                 IMPLEMENTATION SPECIFICS
# ============================================================================================================

# Folder and file structure:
# - It expects:
#   - numbers.json must be available; it's a screen output of decoder.py, which constitutes in last two
#     lines of the file; indeed, including it to other program needs these two lines to encode it to
#     a file, etc., but the scientific sample is manually made and version is verified.
# - It creates:
#   - extension.json folder, where there are extension files created with various parameters; adding and
#     removing data. For example, particular AI would be happy seeing essentials, or even counted numbers,
#     in simple list, and that list could be extracted from numbers.json.
#
# TODO: indeed, at your reading this, the file at hand is not guaranteed or including all the code; rather
#       before it does, I manually remove this message and mark it done. Today is feb 22 of 2026, time is
#       17:45 in Barcelona.

# ============================================================================================================
# 3.0 Tambet Väli                                                                        BELOW: IMPLEMENTATION
# ============================================================================================================
# ============================================================================================================

import json
import os
import math

# In the end, remove "numbers" from each chapter and add it back: it's the last, long element of subchapters.
class ExtChapterOrder:
    def use(self, apply):
        for chapter in apply.data["chapters"]:
            # This should be lightweight using only pointers
            nums = chapter["numbers"]
            del chapter["numbers"]
            chapter["numbers"] = nums

class ExtChapterBounds:
    def use(self, apply):
        for chapter in apply.data["chapters"]:
            bounds = {}
            if chapter["R"] == 0.5:
                bounds["bounded"] = 2 + 4
                bounds["full"] = 2
                bounds["half"] = 1
            else:
                bounds["bounded"] = chapter["base"] ** chapter["R"] + 4
                bounds["full"] = chapter["base"] ** chapter["R"]
                bounds["half"] = chapter["base"] ** chapter["R"] / 2

            chapter["Bounds"] = bounds

# Depends: ExtChapterBounds
class ExtFloat:
    def use(self, apply):
        for chapter in apply.data["chapters"]:
            bounds = chapter["Bounds"]
            for number in chapter["numbers"]:
                floating = {}
                floating["Num"] = None
                floating["Value"] = {}
                floating["Signed"] = {}

                # Value
                # -------------------------------

                # This is rounding out extremes, so "2inf" becomes "2" and other values are fine.
                position = number["Decimal"]["Num"]

                if position == "2inf":
                    position = bounds["full"]
                elif position == "0":
                    position = 0
                else:
                    if float(position) < bounds["half"] + 0.5:
                        position = int(position) - 1
                    else:
                        position = int(position)

                floating["Value"]["Percents"] = str(position / bounds["full"] * 100) + "%"
                floating["Value"]["Units"] = position / bounds["full"]

                # Percentage "0%..100%" is the "Num"
                floating["Num"] = str(math.floor(position / bounds["full"] * 100)) + "%"

                # Signed
                # -------------------------------

                # This is rounding out extremes, so "2inf" becomes "2" and other values are fine.
                position = number["Decimal"]["Signed"]

                if position == "-inf":
                    position = -bounds["half"]
                elif position == "+inf":
                    position = bounds["half"]
                elif position == "-0" or position == "+0":
                    position = 0
                else:
                    position = int(position)

                floating["Signed"]["Percents"] = str(position / bounds["half"] * 200) + "%"
                floating["Signed"]["Units"] = position / bounds["half"] * 2

                # Application
                # -------------------------------

                number["Float"] = floating

class ExtOctave:
    def use(self, apply):
        def square_multiplier(n):
            binary_str = bin(n-1)[2:]  # Convert to binary and remove the "0b" prefix
            return len(binary_str)

        def quad_multiplier(n):
            return square_multiplier(square_multiplier(n)) # Apply sq_mult twice

        for chapter in apply.data["chapters"]:
            bounds = chapter["Bounds"]
            for number in chapter["numbers"]:
                octave = {}
                octave["Num"] = None
                octave["Lower"] = {}
                octave["Higher"] = {}

                # This is rounding out extremes, so "2inf" becomes "2" and other values are fine.
                position = number["Decimal"]["Num"]
                sposition = number["Decimal"]["Signed"]

                if position == "2inf":
                    position = bounds["full"]
                elif position == "0":
                    position = 0
                if sposition == "-0": # check with uint
                    position = int(bounds["half"])
                elif sposition == "+0": # check with uint
                    position = int(bounds["half"] + 1)
                else:
                    position = int(position)

                # This is rounding out extremes, so "2inf" becomes "2" and other values are fine.

                if sposition == "-inf":
                    sposition = -bounds["half"]
                elif sposition == "+inf":
                    sposition = bounds["half"]
                if sposition == "-0":
                    sposition = 0
                elif sposition == "+0":
                    sposition = 0
                else:
                    sposition = int(sposition)

                def lowerOct(n):
                    if n < 0: return -lowerOct(-n)
                    
                    if n >= 2:
                        return square_multiplier(n)
                    elif n == 1:
                        return 0.5
                    elif n == 0:
                        return 0

                def higherOct(n):
                    if n < 0: return -higherOct(-n)
                    
                    if n >= 4:
                        return quad_multiplier(n)
                    elif n == 3:
                        return 0.5
                    elif n == 2:
                        return 0.25
                    elif n == 1:
                        return 0.25
                    elif n == 0:
                        return 0

                octave["Lower"]["Num"] = lowerOct(position)
                octave["Lower"]["Signed"] = lowerOct(sposition)
                octave["Lower"]["D"] = position
                octave["Lower"]["sD"] = sposition

                octave["Higher"]["Num"] = higherOct(position)
                octave["Higher"]["Signed"] = higherOct(sposition)

                octave["Num"] = octave["Lower"]["Num"]

                number["Octave"] = octave

class ExtAnimator:
    def use(self, apply):
        id0 = 0
        id1 = 1
        idx0 = 0
        idx1 = 1
        update = False
        chapters = []
        numbers = []
        
        for chapter in apply.data["chapters"]:
            # Preregister the chapter
            pchapter = { }

            if update:
                idx0 += 1
                idx1 += 1

            # Apply state
            pchapter["id"] = { }
            pchapter["id"]["Num"] = idx0
            pchapter["id"]["Id0"] = { }
            pchapter["id"]["Id0"]["Num"] = idx0
            pchapter["id"]["Id1"] = { }
            pchapter["id"]["Id1"]["Num"] = idx1
            # Register R as chapter index in json reader for this extension or in general
            pchapter["R"] = chapter["R"]
            if "special" in chapter:
                pchapter["special"] = chapter["special"]
            pchapter["base"] = chapter["base"]
            pchapter["Bounds"] = chapter["Bounds"]
        
            bounds = chapter["Bounds"]
            for number in chapter["numbers"]:
                # Preregister the number
                pnumber = { }

                if update:
                    id0 += 1
                    id1 += 1

                # Apply state
                pnumber["id"] = { }
                pnumber["id"]["Num"] = id0
                pnumber["id"]["Id0"] = { }
                pnumber["id"]["Id0"]["Num"] = id0
                pnumber["id"]["Id1"] = { }
                pnumber["id"]["Id1"]["Num"] = id1
                pnumber["Decimal"] = { }
                pnumber["Decimal"]["Num"] = number["Decimal"]["Num"]
                pnumber["Chapter"] = { }
                pnumber["Chapter"]["Num"] = pchapter["id"]["Num"]
                pnumber["Chapter"]["id"] = { }
                pnumber["Chapter"]["id"]["Num"] = pchapter["id"]["Num"]
                pnumber["R"] = pchapter["R"]
                pnumber["T"] = number["Decimal"]
                if pnumber["R"] == 0.5:
                    pnumber["T"]["Laegna"] = number["Laegna"]["Bin"]
                    pnumber["T"]["Wave"] = number["Wave"]["Bin"]
                else:
                    pnumber["T"]["Laegna"] = number["Laegna"]["Num"]
                    pnumber["T"]["Wave"] = number["Wave"]["Num"]

                #remember to update id's
                update = True

                numbers += [ pnumber ]

            #do not forget
            update = True

            # Apply all extensions; ultimate identifier
            chapters += [ pchapter ]

        apply.animation = { }
        apply.animation["numbers"] = numbers
        apply.animation["chapters"] = chapters

        self.numbers = numbers
        self.chapters = chapters
        self.data = apply.data

        # Data and state preparation finished
        # - Use the internal, more plugin-like version of itself
        self.internalTools(apply)

    def internalTools(self, apply):
        apply.tool(self)

    def tools(self, apply):
        print("save")
        self.save(apply)

    # This can save only json: format is internal to tool use
    def save(self, apply):
        jsond = { }

        jsond["meta"] = { }
        jsond["meta"]["Version"] = 1
        jsond["meta"]["description"] = "Laegna / Waveweaver initial timeline"

        jsond["chapters"] = apply.animation["chapters"]

        # Animation keeps track in sequenced order and uses drivers.
        jsond["script"] = apply.animation["numbers"]

        encoder = json.JSONEncoder()
        encoder.indent = 2
        data = encoder.encode(jsond)
        apply.writeone(data, "animation.json")

class ApplyExtensions:
    def __init__(self, input_files = None, output_folder=None):
        if input_files == None:
            input_files = ["numbers.bin.json", "numbers.json"]

        if output_folder == None:
            output_folder = "numberdatabase"

        self.input_files = input_files
        self.output_folder = output_folder
        self.tools = []

    def refer(self):
        print("refer")
        for tool in self.tools:
            # Apply deferred tools in registered tool (extension)
            # - simplified: put all it's tools in one function, but
            # then read this code to understand the sequence.
            print("tool")
            tool.tools(self)

    # defer a tool / "apply.tool" for long name :P
    def tool(self, ext):
        print("tool", ext)
        self.tools += [ext]

    def reads(self):
        data = {}

        data["meta"] = {}
        data["meta"]["version"] = 1
        data["meta"]["description"] = "Laegna / Waveweaver complete number system"
        data["chapters"] = []

        for input_file in self.input_files:
            with open(input_file, 'r') as f:
                data1 = json.load(f)

            for chapter in data1["chapters"]:
                data["chapters"] += [chapter]


        self.data = data
        self.writelist = []

    def extend(self, extension):
        extension.use(self)

    def writeone(self, data, filename):
        self.writelist += [{ "data": data, "filename": filename }]

    def writeflat(self):
        self.refer() # run deferred tasks
        
        flat_output_folder = self.output_folder + "/flatlist"
        
        # Create the output directory (if it doesn't exist)
        if not os.path.exists(flat_output_folder):
            os.makedirs(flat_output_folder)

        # These types of files are most easy to handle for certain people, especially
        # to develop.

        with open(flat_output_folder + "/toc.md", "w") as f:
            f.write("Files in this folder resemble the ones you can open with classical programming " +
                    "books; and where most people do not lack a viewer or skill at all; but indeed they " +
                    "can be bored; hardly they contain very much data.\n\n")

            f.write("You can customize the data with extensions.py for reading in arbitrary programs.")

        with open(flat_output_folder + "/laegna.md", "w") as f:
            for chapter in self.data["chapters"]:
                f.write("# " + str(chapter["R"]) + "\n\n")
                bounds = chapter["Bounds"]
                for number in chapter["numbers"]:
                    if chapter["base"] == 2:
                        f.write("`" + number["Laegna"]["Bin"] + "` ")
                    else:
                        f.write("`" + number["Laegna"]["Num"] + "` ")

                f.write("\n\n")

        with open(flat_output_folder + "/laegnawaves.md", "w") as f:
            for chapter in self.data["chapters"]:
                f.write("# " + str(chapter["R"]) + "\n\n")
                bounds = chapter["Bounds"]
                for number in chapter["numbers"]:
                    if chapter["base"] == 2:
                        f.write("`" + number["Wave"]["Bin"] + "` ")
                    else:
                        f.write("`" + number["Wave"]["Num"] + "` ")

                f.write("\n\n")

        with open(flat_output_folder + "/laeequality.md", "w") as f:
            for chapter in self.data["chapters"]:
                f.write("# " + str(chapter["R"]) + "\n\n")
                bounds = chapter["Bounds"]
                for number in chapter["numbers"]:
                    if chapter["base"] == 2:
                        f.write("$" + (number["Laegna"]["Bin"] if number["Laegna"]["Bin"]!=None else "NULL") + " = " + (number["Decimal"]["Bin"] if number["Decimal"]["Bin"]!=None else "NULL") + "$\n\n")
                    else:
                        f.write("$" + (number["Laegna"]["Num"] if number["Laegna"]["Num"]!=None else "NULL") + " = " + (str(number["Decimal"]["Num"]) if number["Decimal"]["Num"]!=None else "NULL") + "$\n\n")

                f.write("\n\n")

        with open(flat_output_folder + "/waveequality.md", "w") as f:
            for chapter in self.data["chapters"]:
                f.write("# " + str(chapter["R"]) + "\n\n")
                bounds = chapter["Bounds"]
                for number in chapter["numbers"]:
                    if chapter["base"] == 2:
                        f.write("$" + (number["Wave"]["Bin"] if number["Wave"]["Bin"]!=None else "NULL") + " = " + (number["Decimal"]["Bin"] if number["Decimal"]["Bin"]!=None else "NULL") + "$\n\n")
                    else:
                        f.write("$" + (number["Wave"]["Num"] if number["Wave"]["Num"]!=None else "NULL") + " = " + (str(number["Decimal"]["Num"]) if number["Decimal"]["Num"]!=None else "NULL") + "$\n\n")

                f.write("\n\n")

        with open(flat_output_folder + "/multiline.md", "w") as f:
            for chapter in self.data["chapters"]:
                f.write("# " + str(chapter["R"]) + "\n\n")
                bounds = chapter["Bounds"]
                for number in chapter["numbers"]:
                    if chapter["base"] == 2:
                        if number["Decimal"]["Bin"] != None:
                            f.write("##### " + number["Decimal"]["Bin"] + "=" + " (bin)\n")
                        else:
                            f.write("##### ?= (bin)\n")
                            
                        if number["Laegna"]["Bin"] != None:
                            f.write("Laegna: $" + number["Laegna"]["Bin"] + "$." + "\n")
                        else:
                            f.write("?;\n")

                        if number["Wave"]["Bin"] != None:
                            f.write("Wave: $" + number["Wave"]["Bin"] + "$." + "\n")
                        else:
                            f.write("?.\n")

                        f.write("\n")
                    else:
                        if number["Decimal"]["Num"] != None:
                            f.write("##### " + str(number["Decimal"]["Num"]) + "=" + "\n")
                        else:
                            f.write("##### ?=\n")
                            
                        if number["Decimal"]["Bin"] != None:
                            f.write("Laegna: $" + number["Laegna"]["Num"] + "$." + "\n")
                        else:
                            f.write("?;\n")

                        if number["Decimal"]["Bin"] != None:
                            f.write("Wave: $" + number["Wave"]["Num"] + "$." + "\n")
                        else:
                            f.write("?.\n")

                        f.write("\n")

                f.write("\n\n")

        for writeaction in self.writelist:
            with open(flat_output_folder + "/" + writeaction["filename"], "w") as f:
                f.write(writeaction["data"])


    def writes(self):
        # Create the output directory (if it doesn't exist)
        if not os.path.exists(self.output_folder):
            os.makedirs(self.output_folder)

        # Write complete json file
        with open(self.output_folder + "/complete.json", "w") as f:
            json.dump(self.data, f, indent=2)

        # Create the output directory (if it doesn't exist)
        if not os.path.exists(self.output_folder + "/flatlist"):
            os.makedirs(self.output_folder + "/flatlist")

        self.writeflat()

def process_numbers_json():
    """
    Reads numbers.json, processes it based on the number list structure,
    and saves the structured data to a file named extension.json in the
    same directory as the script.
    """

    apply = ApplyExtensions() # create workspace (of open files and objects)
    apply.reads() # read files

    # Chapters include number boundary metadata
    apply.extend(ExtChapterBounds())

    # Percentages and range-relative positions in mostly floats
    apply.extend(ExtFloat())

    # fix the order:
    #   Order of adding blocks remains.
    apply.extend(ExtChapterOrder())

    # Basic information about Octaves
    apply.extend(ExtOctave())

    # Basic information about Octaves
    apply.extend(ExtAnimator())

    apply.writes() # write files

# Example Usage:
if __name__ == "__main__":
    process_numbers_json()
