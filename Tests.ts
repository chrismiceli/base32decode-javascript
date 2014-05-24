// <reference path="Base32Decode.ts" />
// <reference path="Scripts/typings/qunit/qunit.d.ts" />

test("null or undefined check", function () {
    // Base32Decode requires a valid input string
    var base32EncodedString;
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when argument is undefined");
    base32EncodedString = null;
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when argument is null");
});

test("Length check", function () {
    // Base32Decode should require input strings either correctly padded or of the correct length.
    var base32EncodedString = "";
    notThrows(() => Base32Decode(base32EncodedString), "Base32Decode shouldn't throw when argument is empty string");
    base32EncodedString = "a";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when the argument is not the correct length");
    base32EncodedString = "aa";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when the argument is not the correct length");
    base32EncodedString = "aaa";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when the argument is not the correct length");
    base32EncodedString = "aaaa";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when the argument is not the correct length");
    base32EncodedString = "aaaaa";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when the argument is not the correct length");
    base32EncodedString = "aaaaaa";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when the argument is not the correct length");
    base32EncodedString = "aaaaaaa";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode throws when the argument is not the correct length");
    base32EncodedString = "aaaaaaaa";
    notThrows(() => Base32Decode(base32EncodedString), "Base32Decode does not throw when the argument is the correct length");
});

test("Valid Characters", function () {
    // Base32Decode should only recognize valid characters
    var base32EncodedString = "00000000";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode doesn't allow the 0 character");
    base32EncodedString = "11111111";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode doesn't allow the 1 character");
    base32EncodedString = "88888888";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode doesn't allow the 8 character");
    base32EncodedString = "99999999";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode doesn't allow the 9 character");
    base32EncodedString = "2222=222";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode doesn't allow the = character except for padding");
    base32EncodedString = "a=======";
    throws(() => Base32Decode(base32EncodedString), "Base32Decode doesn't allow incorrect padding");
    base32EncodedString = "abcdefghijklmnopqrstuvwxyz234567aaaaaaaa";
    notThrows(() => Base32Decode(base32EncodedString), "Base32Decode shouldn't throw with valid characters");
    base32EncodedString = "ab======";
    notThrows(() => Base32Decode(base32EncodedString), "Base32Decode shouldn't throw with valid characters");
});

test("Case indifference", function () {
    // Base32Decode should behave the same for upper and lower cased characters
    var lowerCase = Base32Decode("aaaaaaaa");
    var upperCase = Base32Decode("AAAAAAAA");
    for (var i = 0; i < 5; i++) {
        ok(lowerCase[i] === upperCase[i], "Base32Decode does not care about casing");
    }
});

test("Base32Decoding", function () {
    // Base32Decode should correclty decode some sample inputs correctly
    var base32DecodedArray = Base32Decode("aaaaaaaa");
    for (var i = 0; i < 5; i++) {
        strictEqual(base32DecodedArray[i], 0, "Base32Decode decodes properly");
    }

    base32DecodedArray = Base32Decode("77777777");
    for (var i = 0; i < 5; i++) {
        strictEqual(base32DecodedArray[i], 255, "Base32Decode decodes properly");
    }
});

test("Test Vectors", function () {
    // Base32Decode should correctly decode the test vectors from the RFC
    strictEqual(Base32Decode("").length, 0, "Base32Decode should return an empty array for the empty string");
    ok(compareUint8ArrayToString(Base32Decode("MY======"), "f"), "Base32Decode should return 'f' for 'MY======'");
    ok(compareUint8ArrayToString(Base32Decode("MZXQ===="), "fo"), "Base32Decode should return 'f' for 'MZXQ===='");
    ok(compareUint8ArrayToString(Base32Decode("MZXW6YQ="), "foob"), "Base32Decode should return 'foob' for 'MZXW6YQ='");
    ok(compareUint8ArrayToString(Base32Decode("MZXW6YTB"), "fooba"), "Base32Decode should return 'fooba' for 'MZXW6YTB'");
    ok(compareUint8ArrayToString(Base32Decode("MZXW6YTBOI======"), "foobar"), "Base32Decode should return 'foobar' for 'MZXW6YTBOI======'");
});

var compareUint8ArrayToString = function (base32DecodedArray: Uint8Array, testString: string): boolean {
    /// <summary>Compares a string to a Uint8Array for equality based on char codes</summary>
    /// <param name="base32DecodedArray" type="Uint8Array">The Uint8Array</param>
    /// <param name="testString" type="String">The string</param>
    /// <returns type="boolean">True if the Uint8Array has the char codes that match the string</returns>
    if (base32DecodedArray.length !== testString.length) {
        return false;
    }

    for (var index: number = 0; index < base32DecodedArray.length; index++) {
        if (base32DecodedArray[index] !== testString.charCodeAt(index)) {
            return false;
        }
    }

    return true;
}

var notThrows = function (statement, message: string): void {
    /// <summary>Verifies whether a given statement does not throw</summary>
    /// <param name="statement" type="any">The statement to execute</param>
    /// <param name="message" type="String">The message to pass or fail with</param>
    try {
        statement();
        ok(true, message);
    }
    catch (exception) {
        ok(false, message);
    }
}