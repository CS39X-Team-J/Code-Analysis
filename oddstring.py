def odd_string_chars(word):
    # return a version of the string where every even character is removed
    # example: Peaches -> ece, Caterpillar -> aeplr
    newword = ''
    for i in range(1, len(word), 2):
        newword += word[i]
    return newword

# test your function by calls
