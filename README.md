# Crumbls-Web-Scraper
Click and point to turn any webpage into an API.

This Chrome extension is in early beta.   It's final goal is to provide a replacement for Kimono Lab's very useful plugin.

The client side version relies heavily on artoo.js by MediaLab ( https://github.com/medialab/artoo )
The server side sits on crumbls.com and runs PhantomJS by Ariya ( https://github.com/ariya/phantomjs )

The GUI isn't complete and I woudl love to work with a designer to develop it.

Load the extension as an unpacked extension inside of chrome://extensions

Once installed, you will get a plugin icon in the upper right.  

How the client side version works:
1) Initialize the extension ( background is blue )
2) Navigate to the page you want to scrape.
3) Open your console.
4) Click elements that you want to target.  It will look for similar elements based off of their css path.
5) Console will report results as a JSON object.

How the server side version works ( Hidden until GUI is complete ):
1) Innitialize the extension ( background is blue )
2) Navigate to the page you wish to click.
3) When completed, hit save.  It passes your request variables to the server, which builds a new job on the system.
4) New page opens, provides data manipulation and data access URL.  The job is called live when the url is requested.

Please report any bugs, errors or feature requests to chase@crumbls.com.

Want to develop this into more of a project?  I'm needing help from a gui designer.  Please email me at chase@crumbls.com.  Right now, the project is open source.  At some point, I'd like to look at monetizing it and would include anyone who contributes on that.  I do have a budget for a good gui designer.
