/**
 * Copyright (c) 2015, rpgtoolkit.net <help@rpgtoolkit.net>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/.
 */
package net.rpgtoolkit.html5.engine.plugin;

import java.awt.Desktop;
import java.io.File;
import java.net.URI;
import java.util.Collection;
import net.lingala.zip4j.core.ZipFile;
import net.rpgtoolkit.pluginsystem.Engine;
import org.apache.commons.io.FileExistsException;
import org.apache.commons.io.FileUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import ro.fortsoft.pf4j.Extension;
import ro.fortsoft.pf4j.Plugin;
import ro.fortsoft.pf4j.PluginWrapper;

/**
 *
 *
 * @author Joshua Michael Daly
 */
public class Html5EnginePlugin extends Plugin {

    private static Thread ENGINE_THREAD;
    private static EngineRunnable ENGINE_RUNNABLE;
    private static File TEMP_PROJECT;

    public Html5EnginePlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {
        System.out.println("Html5EnginePlugin.start()");
    }

    @Override
    public void stop() {
        System.out.println("WelcomePlugin.stop()");
    }

    @Extension
    public static class Html5Engine implements Engine {

        public void run(String projectName, File projectCopy) throws Exception {
            embedEngine(projectName, projectCopy);
            startEmbeddedServer(projectCopy.getAbsolutePath());
            openDefaultBrowser();
        }
        
        public void stop() throws Exception {
            ENGINE_RUNNABLE.stop();
            FileUtils.deleteQuietly(TEMP_PROJECT);
        }

        private void embedEngine(String title, File destination) throws Exception {
            TEMP_PROJECT = destination;
            
            String destinationPath = destination.getAbsolutePath();
            
            // Copy and extract engine zip in destination directory.     
            String engineZipName = "engine-html5.zip";
            File engineZip = new File(destinationPath + "/" + engineZipName);
            FileUtils.copyInputStreamToFile(getClass().getResourceAsStream("/" + engineZipName), engineZip);
            
            ZipFile zipFile = new ZipFile(destinationPath + "/" + engineZip.getName());
            zipFile.extractAll(destinationPath);

            // Clean up the zip.
            FileUtils.deleteQuietly(new File(destinationPath + "/" + engineZip.getName()));

            // Find project game file.
            Collection<File> files = FileUtils.listFiles(destination, new String[]{"game"}, false);
            if (files.isEmpty()) {
                throw new Exception("No game file present in project directory!");
            }

            // Just take the first available.
            File gameFile = files.iterator().next();
            File renamedGameFile = new File(destination.getAbsolutePath() + "/default.game");

            // Rename game file.
            try {
                FileUtils.moveFile(gameFile, renamedGameFile);
            } catch (FileExistsException ex) {
                // Their project is called "default".
            }

            // Modify index.html file for this project.
            File indexFile = new File(destinationPath + "/index.html");
            Document document = Jsoup.parse(indexFile, null);
            document.title(title);

            // Write out modified index.html.
            FileUtils.writeStringToFile(indexFile, document.outerHtml(), "UTF-8");
        }

        private void startEmbeddedServer(String resourceBase) throws Exception {
            ENGINE_RUNNABLE = new EngineRunnable(resourceBase);
            ENGINE_THREAD = new Thread(ENGINE_RUNNABLE);
            ENGINE_THREAD.start();
        }

        private void openDefaultBrowser() throws Exception {
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().browse(new URI("http://localhost:8080"));
            } else {
                throw new Exception("Cannot open default browser!");
            }
        }

    }

    // For testing.
    public static void main(String[] args) throws Exception {
        Html5EnginePlugin.Html5Engine h = new Html5EnginePlugin.Html5Engine();
        h.run("The Wizard's Tower-JS", new File("C:\\Users\\user\\Desktop\\The Wizard's Tower-JS"));
        
        Thread.sleep(10000);
        
        h.stop();
    }

}
