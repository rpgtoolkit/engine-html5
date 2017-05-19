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
import javax.swing.ProgressMonitor;
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

    }

    @Override
    public void stop() {

    }

    @Extension
    public static class Html5Engine implements Engine {

        public void run(String projectName, File projectCopy, ProgressMonitor progressMonitor) throws Exception {
            embedEngine(projectName, projectCopy, progressMonitor);
            startEmbeddedServer(projectCopy.getAbsolutePath());

            // 75% 
            progressMonitor.setProgress(75);
            openDefaultBrowser();

            // 100% 
            progressMonitor.setProgress(100);
        }

        public void stop() throws Exception {
            ENGINE_RUNNABLE.stop();
        }

        public void stop(ProgressMonitor progressMonitor) throws Exception {
            ENGINE_RUNNABLE.stop();
            progressMonitor.setProgress(50);
            FileUtils.deleteQuietly(TEMP_PROJECT);
            progressMonitor.setProgress(100);
        }

        private void embedEngine(String title, File destination, ProgressMonitor progressMonitor) throws Exception {
            TEMP_PROJECT = destination;
            String destinationPath = destination.getAbsolutePath();

            // Copy and extract engine zip in destination directory.
            String engineZipName = "engine-html5.zip";
            File engineZip = new File(destinationPath + "/" + engineZipName);
            FileUtils.copyInputStreamToFile(getClass().getResourceAsStream("/" + engineZipName), engineZip);

            ZipFile zipFile = new ZipFile(destinationPath + "/" + engineZip.getName());
            zipFile.extractAll(destinationPath);

            // 25%
            progressMonitor.setProgress(25);

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

            // 50% 
            progressMonitor.setProgress(50);

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

}
